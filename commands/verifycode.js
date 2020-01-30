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
    if (args.length !== 1) {
        await message.channel.send('Please provide a verification code');
        return;
    }
    const code = args[0];

    // Get user
    const verification_user_json = await state.keyv.get(user.id);
    // Store verification code
    const verification_user = VerificationUser.fromJson(verification_user_json);
    const result = verification_user.checkVerificationCode(code);

    if (!result) {
        await message.channel.send(
            'The code was incorrect or expired. Please enter again or restart the verification process ' +
            'with `!verifyemail <email>`');
        return;
    }

    await utils.addVerifiedRoleToGuildMember(guildmember);
    await message.channel.send(`Verification successful. Welcome to **${guild.name}**!`);

    verification_user.verified = true;

    // Store object back in db
    await state.keyv.set(user.id, verification_user.toJson());
}

module.exports = {
    name: 'verifycode',
    description: 'Takes a verification code and check that it is correct',
    guildOnly: false,
    execute: execute,
}
