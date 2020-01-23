const utils = require('../utils.js');

/*
 * Reply with message 'uwu'
 * @param message discord.js Message object
 * @param args string[] arguments
 */
async function execute(message, args) {
    const user = message.author;
    if (!user.dmChannel) {
        try {
            user.createDM().then().catch(err => {console.error(err)});
        } catch (error) {
            send_error_message(user.id, message.channel);
            console.error(error);
            return;
        }
    }
    try {
        await user.send('hello there');
    } catch (error) {
        send_error_message(user.id, message.channel);
        console.error(error);
    }
    // message.channel.send('hello there');
}

/* Send an error message explaining to the user why we can't
 * DM them
 * @param userid    int     Discord ID of the user
 * @param channel   Channel discord.js object, the channel to message them on
 */
function send_error_message(userid, channel) {
    const output =
        `Hi ${utils.mention(userid)}. It looks I don't have permission to direct ` +
        `message (DM) you. Please go into your User Settings > Privacy & Safety and enable ` +
        `direct messaging from server members so I can start the verification process.`

    channel.send(output);
}

module.exports = {
    name: 'verify',
    description: 'Start the verification process',
    guildOnly: true,
    execute: execute,
}
