'use strict';

const utils = require('../utils.js');
const config = require('../config.json');

/*
 * Begins the user verification process
 * @param message discord.js Message object
 * @param args string[] arguments
 */
async function execute(message, args) {
    const user = message.author;

    // Establish DM channel
    if (!user.dmChannel) {
        try {
            await user.createDM();
        } catch (error) {
            send_permission_error_message(user.id, message.channel);
            console.error(error);
            return;
        }
    }

    try {
        // Check message is from a DM channel
        if (message.channel.type !== 'dm') {
            await message.channel.send(`${utils.mention(user.id)} For your privacy, please send this command by messaging me directly.`);
            await message.delete();
            return;
        }

        message.channel.send('it went through');
    } catch (error) {
        utils.send_generic_error_message(user.id, message.channel);
        console.error(error);
        return;
    }
    /*
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
        utils.send_generic_error_message(user.id, message.channel);
        return;
    }

    // Message user
    try {
        await user.send(
            `Hello! Please type \`!verifyemail <your email address>\` here to begin the verification process for **${guild.name}**. ` +
            'Example: `!verifyemail johncitizen@some_email.com`');
    } catch (error) {
        console.error(error);
        return;
    }
    */
}

module.exports = {
    name: 'verifyemail',
    description: 'Sends a verification email to the user',
    guildOnly: false,
    execute: execute,
}
