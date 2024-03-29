# UNSW-Minecraft-Society-Discord-Verification-Bot
Email verification bot for UNSW Minecraft Society's Discord server

## Development setup

To run this bot you will need to have Node.js installed, which can be downloaded [here](https://nodejs.org/en/). Using Node Version Manager (nvm) is recommended.

To install the dependencies run this in the terminal:
```shell
npm install
```

To start the bot, run this in the terminal:
```shell
npm start
```

The bot uses the DiscordJS library. You may find documentation and guides on using the library here: 
- https://discordjs.guide/
- https://discord.js.org

## Deployment

A simple and fairly reliable way to deploy this bot is to use [Process Manager 2](https://pm2.keymetrics.io/). Possible deployment method:
1. Install PM2 globally: `npm install -g pm2`
2. Run the included startup script: `./startbot.sh`

Bot invite link: https://discordapp.com/oauth2/authorize?client_id=<APPLICATION ID>&scope=bot&permissions=268446784


## Configuration

Make a copy of `config.example.json` and name it `config.json`. Then add your settings.

| **Setting** | **Description** | **Example** |
| ----------- | --------------- | ----------- |
| `prefix` | What a command must be preceded with for the bot to recognise it | `!` |
| `token` | Discord bot token. Get this from the Discord Developer Portal (https://discordapp.com/developers/applications/) | |
| `channels.allowed_channels` | Which guild channels the bot is allowed to reply and handle messages | `["first channel's id", "second channel's id"]` |
| `channels.admin_channels` | Which guild channels should the bot listen and reply to its admin commands | `["first admin channel's id", "second admin channel's id"]` |
| `guild_id` | The ID of the Discord server (i.e. guild) this bot is being used on | `123456789012345678` |
| `exec_role_id` | The society executive Discord role ID | `123456789012345678` |
| `verified_role_id` | The Discord role ID that the bot should promote the user to when they are successfully verified | `123456789012345678` |
| `from_email` | Email that the user should reply/send to if they need to contact you. | johncitizen@blahblah.com |
| `from_name` | Your name | John Citizen |
| `delete_bot_reply_timeout` | Some message replies from this bot can be automatically deleted after a certain time to reduce unintentional spamming. Set to a value greater than 0 to enable. Value is measured in milliseconds. | `30000` (30 seconds) |
| `url_api_key` | The API key to pass to the endpoint for 'find_user_url' | `some-api-key-string` |
| `verify_url` | The URL the bot should use to send a verification request | `https://your_verification_url_here.com/endpoint/` |
| `find_user_url` | The URL the bot should use to retrieve user information | `https://your_find_user_url_here.com/endpoint/` |
| `signup_form_url` | URL to your signup form | `https://your_form_url_here.com` |
