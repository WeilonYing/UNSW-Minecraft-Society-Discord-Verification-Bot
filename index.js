'use strict';

// module declarations
const Discord = require('discord.js');
const config = require('./config.json');
//import in_allowed_channel from 'utils.js';
const Utils = require('./utils.js');

// constant declarations
const prefix = config.prefix;

// helper function declarations

function inAllowedChannel(channelname) {
    let allowed = config.channels.allowed_channels;
    allowed.join(config.channels.admin_channels);
    return allowed.includes(channelname);
}

// Client code
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
});

client.login(config.token);

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }
    if (!Utils.in_allowed_channel(message.channel.id)) {
        return;
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'uwu') {
        message.channel.send('owo');
    } else if (command === 'owo') {
        message.channel.send('uwu');
    } else if (command === 'avatar') {
        return message.channel.send(`<${message.author.displayAvatarURL}>`);
    }
});



