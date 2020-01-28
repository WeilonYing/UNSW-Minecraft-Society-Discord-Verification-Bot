'use strict';

const utils = require('../utils.js');
const config = require('../config.json');

/*
 * Begins the user verification process
 * @param client discord.js Client object
 * @param message discord.js Message object
 * @param args string[] arguments
 */
async function execute(client, message, args) {
    const user = message.author;

    // Establish DM channel
    if (!user.dmChannel) {
        try {
            await user.createDM();
        } catch (error) {
            await send_permission_error_message(user.id, message.channel);
            console.error(error);
            return;
        }
    }

    // Check message is from the correct guild
    const guild = message.channel.guild;
    try {
        if (message.channel.type !== 'text') {
            throw new TypeException("Channel type must be 'text'", 'verify.js');
        }
        if (guild.id !== config.guild_id) {
            throw new Error('Verification sent from invalid guild. Verification can only be done from the guild set in guild_id in config.json');
        }
    } catch (error) {
        console.error(error);
        await utils.send_generic_error_message(user.id, message.channel);
        return;
    }

    // Message user
    try {
        await user.send(
            `Hello! Please type \`!verifyemail <your email address>\` here to begin the verification process for **${guild.name}**. ` +
            'Example: `!verifyemail johncitizen@some_email.com`');
    } catch (error) {
        await send_permission_error_message(user.id, message.channel);
        console.error(error);
        return;
    }

    // Send acknowledgement reaction
    await message.react('👍'); // thumbs up emoji
}

/* Send an error message explaining to the user why we can't DM them
 * @param userid    int     Discord ID of the user
 * @param channel   Channel discord.js object, the channel to message them on
 */
async function send_permission_error_message(userid, channel) {
    const output =
        `Hi ${utils.mention(userid)}. It looks I don't have permission to direct ` +
        'message (DM) you. Please go into your User Settings > Privacy & Safety and enable ' +
        'direct messaging from server members so I can start the verification process. \n' +
        'If instead you would like to continue in read-only mode. You can safely disregard this message. ' +
        'You may come back to this channel to verify later if you decide to.'

    const reply = await channel.send(output);
    await utils.maybe_delete_message(reply);
}

module.exports = {
    name: 'verify',
    description: 'Starts the verification process',
    guildOnly: true,
    execute: execute,
}
