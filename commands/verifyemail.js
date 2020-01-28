'use strict';

const utils = require('../utils.js');
const config = require('../config.json');

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/*
 * Begins the user verification process
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
            await utils.send_generic_error_message(user.id, message.channel);
            console.error(error);
            return;
        }
    }

    // Test user provided an email arg
    if (args.length !== 1) {
        await message.channel.send('Please provide an email address. E.g. `!verifyemail johncitizen@some_email.com`');
        return;
    }
    const email = args[0];

    // Test that email is valid
    if (!emailRegexp.test(email)) {
        await message.channel.send('Please provide a valid email address.');
        return;
    }


    try {
        // Check message is from a DM channel
        if (message.channel.type !== 'dm') {
            const reply = await message.channel.send(
                `${utils.mention(user.id)} For your privacy, please send this command by messaging me directly. ` +
                '(Your message here has been deleted)');
            await message.delete();
            await utils.maybe_delete_message(reply);
            return;
        }

        await message.channel.send('it went through');

        // Check that the guild the bot is in matches that in config.json
        const guild = client.guilds.find(g => g.id === config.guild_id);
        if (!guild) {
            throw new Error('Bot is not in the supplied guild_id in config.json');
        }

        // Get user as guild member
        const guildmember = guild.member(message.author);
        if (!guildmember) {
            await message.channel.send(`You are not a member of **${guild.name}**. Please join the Discord server and try again`);
        }
        await guildmember.addRole(config.verified_role_id, 'User successfully verified their role');
        message.channel.send('You have been verified');
    } catch (error) {
        await utils.send_generic_error_message(user.id, message.channel);
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
