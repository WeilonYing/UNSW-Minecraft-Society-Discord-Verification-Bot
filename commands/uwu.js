module.exports = {
	name: 'uwu',
	description: 'uwu',
    /*
     * Reply with message 'owo'
     * @param message discord.js Message object
     * @param args string[] arguments
     */
	execute(message, args) {
		message.channel.send('owo');
	},
};
