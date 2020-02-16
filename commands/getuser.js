'use strict';

// eslint
/* global require, module */
/* eslint no-undef: "error" */

const utils = require('../utils.js');
const config = require('../config.json');
const VerificationUser = require('../VerificationUser.js');

/*
 * Check the passed in verification code
 * @param state BotState object
 * @param message discord.js Message object
 * @param args string[] arguments
 */
async function execute(state, message, args) {
    if (!utils.in_admin_channel(message.channel.id)) {
        return;
    }

    const user = message.author;
    const channel = message.channel;
    const guild = channel.guild;
    const guildmember = guild.member(message.author);

    if (!guildmember.hasPermission('VIEW_AUDIT_LOG')) {
        const reply = await utils.send_no_permission_message(channel);
        await utils.maybe_delete_message(reply);
        return;
    }

    // Test that command has correct number of arguments
    if (args.length !== 2) {
        const reply = await channel.send(
            'Usage: !getuser <discord|minecraft> <discord_id|minecraft_username>');
        await utils.maybe_delete_message(reply);
        return;
    }

    const type = args[0];

    const request_data = {};

    if (type === 'discord') {
        request_data['discord_id'] = args[1];
    } else if (type === 'minecraft') {
        request_data['minecraft_username'] = args[1];
    } else {
        const reply = await channel.send(
            'Usage: !getuser <discord|minecraft> <discord_id|minecraft_username>');
        await utils.maybe_delete_message(reply);
        return;
    }

    // There's a chance the verification request may take more than a few seconds, so let the user know that we're
    // processing the verification

    // Send verification request
    try {
        const loading_message = await channel.send('Getting user...');
        state.request(
            // Request options and payload
            {
                url: config.find_user_url,
                method: "POST",
                json: request_data,
                auth: {
                    bearer: config.url_api_key
                }
            },

            // Callback to process resposne
            async (error, response, body) => {
                // Get rid of loading message
                await loading_message.delete();

                // Parse results
                const results = body.results;
                if (results.length === 0) {
                    await channel.send('No entries found for this user id')
                }
                let message = '';
                for (let i = 0; i < results.length; i++) {
                    message += `**Entry ${i}** \n`
                    message += JSON.stringify(results[i], null, '\t') + '\n';
                    if (i % 3 === 0) {
                        await channel.send(message);
                        message = ''
                    }
                }
                if (message !== '') {
                    await channel.send(message);
                }
            }
        );
    } catch (err) {
        console.error(err);
        await utils.send_generic_error_message(user.id, message.channel);
    }
}


module.exports = {
    name: 'getuser',
    description: 'Gets user either by Discord ID or Minecraft username',
    guildOnly: true,
    execute: execute,
}
