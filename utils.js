'use strict';

const config = require('./config.json');

/* Add verified role to guild member
 * @param guildmember discord.js GuildMember object
 */
async function addVerifiedRoleToGuildMember(guildmember) {
    await guildmember.addRole(config.verified_role_id);
}

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
async function send_generic_error_message(userid, channel) {
    const output =
        `${mention(userid)} Sorry, an error has occurred. ` +
        'Please try again or message an admin if this keeps happening.';

    await channel.send(output);
}

/* Delete a message depending on the delete_bot_reply_message setting
 * If the setting value is 0 or greater, the message will be deleted after
 * that value in milliseconds. Otherwise the message will not be
 * deleted (i.e. if the setting value is -1)
 *
 * @param message   Message discord.js object, the mesasge to be deleted
 */
async function maybe_delete_message(message) {
    try {
        const timeout = config.delete_bot_reply_timeout;
        if (timeout >= 0) {
            await message.delete(timeout);
        }
    } catch (error) {
        console.error(error);
    }
}

exports.addVerifiedRoleToGuildMember = addVerifiedRoleToGuildMember;
exports.in_allowed_channel = in_allowed_channel;
exports.mention = mention;
exports.send_generic_error_message = send_generic_error_message;
exports.maybe_delete_message = maybe_delete_message;


