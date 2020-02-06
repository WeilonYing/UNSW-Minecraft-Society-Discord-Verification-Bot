# UNSW-Minecraft-Society-Discord-Verification-Bot
Email verification bot for UNSW Minecraft Society's Discord server

## Configuration

Make a copy of `config.example.json` and name it `config.json`. Then add your settings.

| **Setting** | **Description** | **Example** |
| ----------- | --------------- | ----------- |
| `prefix` | What a command must be preceded with for the bot to recognise it | `!` |
| `token` | Discord bot token. Get this from the Discord Developer Portal (https://discordapp.com/developers/applications/) | |
| `channels.allowed_channels` | Which guild channels the bot is allowed to reply and handle messages | `["first channel's id", "second channel's id"]` |
| `channels.admin_channels` | Which guild channels should the bot listen and reply to its admin commands | `["first admin channel's id", "second admin channel's id"]` |
| `guild_id` | The ID of the Discord server (i.e. guild) this bot is being used on | `123456789012345678` |
| `verified_role_id` | The ID of the role that the bot should promote the user to when they are successfully verified | `123456789012345678` |
| `email.sendgrid_api_key` | API key for sending emails through the SendGrid API platform. Currently unused. | |
| `email.sendgrid_template_id` | Template ID to identify which SendGrid template to use. Currently unused. | |
| `from_email` | Email that the user should reply/send to if they need to contact you. | johncitizen@blahblah.com |
| `from_name` | Your name | John Citizen |
| `delete_bot_reply_timeout` | Some message replies from this bot can be automatically deleted after a certain time to reduce unintentional spamming. Set to a value greater than 0 to enable. Value is measured in milliseconds. | `30000` (30 seconds) |
| `verify_url` | The URL the bot should use to send a verification request | `https://your_verification_url_here.com/endpoint/` |
| `signup_form_url` | URL to your signup form | `https://your_form_url_here.com` |


