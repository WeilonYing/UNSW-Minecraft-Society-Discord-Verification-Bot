'use strict';

// eslint
/* global require */
/* eslint no-undef: "error" */

// Module declarations
const Discord = require('discord.js');
const request = require('request');
const BotState = require('./BotState.js');
const utils = require('./utils.js');
const config = require('./config.json');
const fs = require('fs'); // file system

// Constants
const prefix = config.prefix;

// Client code
const client = new Discord.Client();

// Find all available commands
client.commands = new Discord.Collection(); // discord.js's Map but better

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
});

client.login(config.token);

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }

    // Check if in allowed guild channel. Note: DM channel types are 'dm', so they're allowed too
    if (!utils.in_allowed_channel(message.channel.id) && message.channel.type === 'text') {
        return;
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) {
        console.error(`Invalid command sent from user id ${message.author.id}; Message content: ${message.content}`);
        return;
    }

    const command = client.commands.get(commandName);

    if (command.guildOnly && message.channel.type !== 'text') {
        const reply = await message.channel.send('This command can only be sent from a Discord server.');
        await utils.maybe_delete_message(reply);
        return;
    }

    try {
        const state = new BotState(client, request);
        await command.execute(state, message, args);
        return;
    } catch (error) {
        await utils.send_generic_error_message(message.author.id, message.channel);
        console.error(error);
    }
});

