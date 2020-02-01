'use strict';

// eslint
/* global require, module */
/* eslint no-undef: "error" */

const uuidv4 = require('uuid/v4');
const utils = require('../utils.js');
const config = require('../config.json');
const VerificationUser = require('../VerificationUser.js');

const zIdRegexp = /^z[0-9]{7}$/;

/*
 * Begins the user verification process for UNSW students
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

    // Test user provided a zID arg
    if (args.length !== 1) {
        await message.channel.send('Please provide your UNSW zID. E.g. `!verifyunsw z0000000`');
        return;
    }
    const zID = args[0];

    // Test that zID is valid
    if (!zIdRegexp.test(zID)) {
        await message.channel.send('Please provide a valid UNSW zID. E.g. z0000000');
        return;
    }

    const email = `${zID}@ad.unsw.edu.au`;

    // Test that user is currently not verified
    let verification_user_json = await state.keyv.get(user.id);
    let verification_user = null;
    if (verification_user_json) {
        verification_user = VerificationUser.fromJson(verification_user_json);
        if (verification_user.verified) {
            // Add the verified role to them just in case they somehow lost the role
            utils.addVerifiedRoleToGuildMember(guildmember);
            await message.channel.send('You have already been verified. Go play :)');
            return;
        }
    }

    // Generate verification code
    const verification_code = uuidv4();

    // Store verification code
    verification_user = new VerificationUser();
    verification_user
        .setUserId(user.id)
        .setEmail(email)
        .setVerificationCode(verification_code, 60000*60*24); // expiry set to 24 hours
    verification_user_json = verification_user.toJson();
    await state.keyv.set(user.id, verification_user_json);

    // Send verification email
    await utils.sendVerificationEmailToUser(email, verification_code, state.sgClient);
    await message.channel.send(
        `Thanks! An email has been sent to the UNSW email address for **${zID}** with your verification code. ` +
        'Once you receive your verification code, enter it here with `!verifycode <code>`');
}

module.exports = {
    name: 'verifyunsw',
    description: 'Sends a verification email to the user via UNSW email',
    guildOnly: false,
    execute: execute,
}

