'use strict';

const utils = require('../utils.js');
const config = require('../config.json');

/*
 * Begins the user verification process
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
            `Welcome to ${guild.name}. \n` +
            '***If you have already filled out the membership/whitelist form***, an email has been sent to the address ' +
            'provided on the form. **FOR UNSW STUDENTS, that email has been sent to your UNSW email inbox ' +
            '(z1234567@ad.unsw.edu.au)**. A verification code is provided in the email sent to you. \n\n' +

            'The verification code should be in this format: ' +
            '`!verify xxxxxxxxxxxxxxxxxxxx xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` \n' +
            'DM this command + code here to get verified. \n\n' +

            `***If you have not filled out the form:*** you can do so here ${config.signup_form_url}, ` +
            'and then follow the instructions above. \n\n' +

            'If you are having problems with verifying please @exec in the #verification chat.\n' +
            'You do not need to verify to play on our Minecraft server: mc.unswminecraft.com'
        );
    } catch (error) {
        await send_permission_error_message(user.id, message.channel);
        console.error(error);
        return;
    }

    // Send acknowledgement reaction
    await message.react('👍'); // thumbs up emoji
}

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
    name: 'verifyme',
    description: 'Starts the verification process',
    guildOnly: true,
    execute: execute,
}
