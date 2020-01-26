'use strict';

const config = require('./config.json');

/* Test that channel_id is in allowed channels as defined in config.json
 * @param channel_id    int channel id
 * @return  boolean true if channel id is allowed
 */
function in_allowed_channel(channel_id) {
    let allowed = config.channels.allowed_channels;
    allowed.join(config.channels.admin_channels);
    return allowed.includes(channel_id);
}

/* Create a mention string for a user
 * @param userid    int id of the user
 * @return string
 */
function mention(userid) {
    return `<@${userid}>`;
}

/* Send a generic error message explaining to the user
 * @param userid    int     Discord ID of the user
 * @param channel   Channel discord.js object, the channel to message them on
 */
function send_generic_error_message(userid, channel) {
    const output =
        `${mention(userid)} Sorry, an error has occurred. ` +
        'Please try again or message an admin if this keeps happening.';

    channel.send(output);
}

exports.in_allowed_channel = in_allowed_channel;
exports.mention = mention;
exports.send_generic_error_message = send_generic_error_message;

