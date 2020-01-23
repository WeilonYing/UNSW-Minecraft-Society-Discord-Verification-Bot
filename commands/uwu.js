/*
 * Reply with message 'owo'
 * @param message discord.js Message object
 * @param args string[] arguments
 */
async function execute(message, args) {
    message.channel.send('owo');
}

module.exports = {
	name: 'uwu',
	description: 'uwu',
    guildOnly: false,
    execute: execute,
};
