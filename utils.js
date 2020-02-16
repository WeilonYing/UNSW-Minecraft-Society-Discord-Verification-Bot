'use strict';

const config = require('./config.json');

/* Send verification email to user
 * @param to_email          string  email address to send to
 * @param verification_code string  verification code to be sent to user
 * @param sgClient          object  SendGrid Client object
 */
async function sendVerificationEmailToUser(
    to_email,
    verification_code,
    sgClient
) {
    const email_data = {
        "from": {
            "email":`${config.email.from_email}`,
            "name":`${config.email.from_name}`
        },
        "personalizations": [
            {
                "to": [
                    {
                        "email": `${to_email}`
                    }
                ],
                "dynamic_template_data": {
                    "verification_code": verification_code
                }
            }
        ],
        "template_id": `${config.email.sendgrid_template_id}`
    };

    const email_request = {
        "body": email_data,
        "method": "POST",
        "url": "/v3/mail/send"
    };

    const response = await sgClient.request(email_request);
    console.log(`Email sent to ${to_email}. Got back response ${response}`);
}

/* Add verified role to guild member
 * @param guildmember discord.js GuildMember object
 */
async function addVerifiedRoleToGuildMember(guildmember) {
    await guildmember.addRole(config.verified_role_id);
}

/* Test that channel_id is in allowed channels as defined in config.json
 * @param   channel_id   string channel id
 * @return  boolean true if channel id is allowed
 */
function in_allowed_channel(channel_id) {
    let allowed = config.channels.allowed_channels;
    return allowed.includes(channel_id) || in_admin_channel(channel_id);
}

/* Test that channel_id is in allowed channels as defined in config.json
 * @param   channel_id   string channel id
 * @return  boolean true if channel id is allowed
 */
function in_admin_channel(channel_id) {
    let admin_channels = config.channels.admin_channels;
    return admin_channels.includes(channel_id);
}

/* Test that the given role is of exec role or higher. The exec role's id
 * must be defined in config.json
 * @param   guild_roles     discord.js Roles collection: Available roles in the guild
 * @param   member_roles    discord.js Roles collection: The member's roles to check against
 * @return  boolean true if the role is exec or higher, false otherwise
 */
function is_exec_or_higher(guild_roles, member_roles) {
    const exec_role = guild_roles.get(config.exec_role_id);
    if (!exec_role) {
        throw new Error('Exec role not in given guild roles');
    }
    for (let i = 0; i < member_roles.length; i++) {
        const current_role = member_roles[i];
        // If exec role is <= 0, then exec role is lower or equal to the given role
        if (exec_role.comparePositionTo(current_role) <= 0) {
            return true;
        }
    }

    // If exec role is > 0, then exec role is higher than the given role
    // Therefore they are not an exec or higher.
    return false;
}

/* Create a mention string for a user
 * @param userid    int id of the user
 * @return string
 */
function mention(userid) {
    return `<@${userid}>`;
}

/* Send a message stating they don't have permission
 * @param channel   Channel discord.js object, the channel to message them on
 * @return message  Message discord.js object
 */
async function send_no_permission_message(channel) {
    const output = 'You do not have permission to use this command.';
    const message = await channel.send(output);
    return message;
}

/* Send a generic error message explaining to the user
 * @param userid    int     Discord ID of the user
 * @param channel   Channel discord.js object, the channel to message them on
 * @return message  Message discord.js object
 */
async function send_generic_error_message(userid, channel) {
    const output =
        `${mention(userid)} Sorry, an error has occurred. ` +
        'Please try again or message an admin if this keeps happening.';

    const message = await channel.send(output);
    return message;
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

exports.sendVerificationEmailToUser = sendVerificationEmailToUser;
exports.addVerifiedRoleToGuildMember = addVerifiedRoleToGuildMember;
exports.in_allowed_channel = in_allowed_channel;
exports.in_admin_channel = in_admin_channel;
exports.is_exec_or_higher = is_exec_or_higher;
exports.mention = mention;
exports.send_no_permission_message = send_no_permission_message;
exports.send_generic_error_message = send_generic_error_message;
exports.maybe_delete_message = maybe_delete_message;


