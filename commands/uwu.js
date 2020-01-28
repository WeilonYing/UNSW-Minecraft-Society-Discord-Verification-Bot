/*
 * Reply with message 'owo'
 * @param state BotState object
 * @param message discord.js Message object
 * @param args string[] arguments
 */
async function execute(state, message, args) {
    message.channel.send('owo');
}

module.exports = {
	name: 'uwu',
	description: 'uwu',
    guildOnly: false,
    execute: execute,
};
