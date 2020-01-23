module.exports = {
    name: 'owo',
    description: 'owo',
    /*
     * Reply with message 'uwu'
     * @param message discord.js Message object
     * @param args string[] arguments
     */
    execute(message, args) {
        message.channel.send('uwu');
    },
}
