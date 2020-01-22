'use strict';

const config = require('./config.json');

function in_allowed_channel(channelname) {
    let allowed = config.channels.allowed_channels;
    allowed.join(config.channels.admin_channels);
    return allowed.includes(channelname);
}

exports.in_allowed_channel = in_allowed_channel;

