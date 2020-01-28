/*
 * Reply with message 'owo'
 * @param client discord.js Client object
 * @param message discord.js Message object
 * @param args string[] arguments
 */
async function execute(client, message, args) {
    message.channel.send('owo');
}

module.exports = {
	name: 'uwu',
	description: 'uwu',
    guildOnly: false,
    execute: execute,
};
