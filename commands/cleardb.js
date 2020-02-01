'use strict';

const utils = require('../utils.js');

/*
 * Clears the database. Must be sent in admin channel.
 * @param state BotState object
 * @param message discord.js Message object
 * @param args string[] arguments
 */
async function execute(client, message, args) {
    // Get guild. We've alreaady done check for guild channel in index.js so no need to do it here
    const guild = message.channel.guild;
    const guildmember = guild.member(message.author);

    if (!utils.in_admin_channel(message.channel.id)) {
        const reply = await message.channel.send('You must send this command in an admin channel');
        await utils.maybe_delete_message(reply);
        return;
    }

    if (!guildmember.hasPermission('ADMINISTRATOR')) {
        const reply = await message.channel.send('You do not have permission to use this command');
        await utils.maybe_delete_message(reply);
        return;
    }

    if (args.length < 1 || args[0] !== 'yes') {
        const reply =
            await message.channel.send('This will clear the entire bot database. Are you sure? Type `!cleardb yes` to confirm this operation.');
        await utils.maybe_delete_message(reply);
        return;
    }

    await client.keyv.clear();
    await message.channel.send('Bot database cleared.');
}

module.exports = {
    name: 'cleardb',
    description: 'Clears the database (i.e. deletes everything). Must be sent in admin channel. VERY DANGEROUS BE CAREFUL WITH THIS.',
    guildOnly: true,
    execute: execute,
}
