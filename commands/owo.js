/*
 * Reply with message 'uwu'
 * @param state BotState object
 * @param message discord.js Message object
 * @param args string[] arguments
 */
async function execute(client, message, args) {
    message.channel.send('uwu');
}

module.exports = {
    name: 'owo',
    description: 'owo',
    guildOnly: false,
    execute: execute,
}
