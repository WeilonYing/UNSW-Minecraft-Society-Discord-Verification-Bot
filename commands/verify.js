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
    const user = message.author;

    // Establish DM channel
    if (!user.dmChannel) {
        try {
            await user.createDM();
        } catch (error) {
            await utils.send_generic_error_message(user.id, message.channel);
            console.error(error);
            return;
        }
    }

    // Check message is from a DM channel
    if (message.channel.type !== 'dm') {
        const reply = await message.channel.send(
            `${utils.mention(user.id)} For your privacy, please send this command by messaging me directly. ` +
            '(Your message here has been deleted)');
        await message.delete();
        await utils.maybe_delete_message(reply);
        return;
    }

    // Check that the guild the bot is in matches that in config.json
    const guild = state.client.guilds.find(g => g.id === config.guild_id);
    if (!guild) {
        throw new Error('Bot is not in the supplied guild_id in config.json');
    }

    // Get user as guild member
    const guildmember = guild.member(message.author);
    if (!guildmember) {
        await message.channel.send(`You are not a member of **${guild.name}**. Please join the Discord server and try again`);
    }

    // Test user provided a verification code arg
    if (args.length !== 2) {
        const reply = await message.channel.send(
            'Please provide a verification code. It should be in this format: \n' +
            '`!verify xxxxxxxxxxxxxxxxxxxx xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`'
        );
        await utils.maybe_delete_message(reply);
        return;
    }

    /* In reality, there are two arguments, separated by spaces. First argument is the
     * user_id which uniquely identifies their entry on Firestore, and the second
     * argument is the verification_code that proves that their provided email actually
     * belongs to the user.
     *
     * To prevent confusion to the user, we publicly refer to the combination of their
     * user_id and verification_code to be their whole "verification code"
     */
    const user_id = args[0];
    const verification_code = args[1];

    const request_data = {
        "user_id": `${user_id}`,
        "verification_code": `${verification_code}`,
        "discord_id": message.author.id
    }

    // There's a chance the verification request may take more than a few seconds, so let the user know that we're
    // processing the verification
    const processing_reply = await message.channel.send('Checking your verification code...');

    // Send verification request
    try {
        state.request(
            // Request options and payload
            {
                url: config.verify_url,
                method: "POST",
                json: request_data
            },

            // Callback to process resposne
            async (error, response, body) => {
                // First get rid of the previous message now that we got a response
                await processing_reply.delete();

                // Determine what to do now that we got a response
                switch (response.statusCode) {
                    case 200: // OK
                        const result = body;
                        if (result.is_verified) { // Add user to verified role
                            await utils
                                .addVerifiedRoleToGuildMember(guildmember);
                            await message
                                .channel
                                .send(
                                    `Verification successful. Welcome to **${guild.name}**! You may now chat on the server.`);
                        } else { // Tell user the verification didn't go through
                            await send_unable_to_verify_message(user.id, message.channel);
                        }
                        break;

                    case 401: // Unauthorised
                        await send_unable_to_verify_message(user.id, message.channel);
                        break;

                    case 400: // Bad request
                    case 405: // Method not allowed
                    case 500: // Internal server error
                    default:
                        await utils.send_generic_error_message(user.id, message.channel);
                        break;
                }
            }
        );
    } catch (err) {
        console.error(err);
        await utils.send_generic_error_message(user.id, message.channel);
    }
}

/* Send an error message explaining to the user we were unable to verify them
 * @param userid    int     Discord ID of the user
 * @param channel   Channel discord.js object, the channel to message them on
 */
async function send_unable_to_verify_message(userid, channel) {
    const output =
        '**Sorry, your verification code was incorrect. Please try one of the following:** \n' +
        '1. Check that the code was entered correctly and try again\n' +
        '2. You need to have filled out our signup form in order to get a verification code. Please fill it out if you haven\'t done so\n' +
        '3. If you already filled out the signup form, you should get an email within 15 minutes of submitting it\n' +
        `4. If none of the above apply, please email us at ${config.email.from_email}`;

    const reply = await channel.send(output);
}

module.exports = {
    name: 'verify',
    description: 'Takes a verification code and check that it is correct',
    guildOnly: false,
    execute: execute,
}
