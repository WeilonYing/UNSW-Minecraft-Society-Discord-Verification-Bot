'use strict';

const config = require('./config.json');

function in_allowed_channel(channelname) {
    let allowed = config.channels.allowed_channels;
    allowed.join(config.channels.admin_channels);
    return allowed.includes(channelname);
}

/* Create a mention string for a user
 * @param userid    int id of the user
 * @return string
 */
function mention(userid) {
    return `<@${userid}>`;
}


exports.in_allowed_channel = in_allowed_channel;
exports.mention = mention;

