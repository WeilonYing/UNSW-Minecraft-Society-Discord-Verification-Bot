'use strict';
// Store things necessary to maintain bot state

class BotState {
    /* Constructor
     * @param client discord.js Client object
     * @param keyv Keyv object
     * @param sgMail SendGrid mail object
     */
    constructor(client, keyv, sgMail) {
        this.client = client;
        this.keyv = keyv;
        this.sgMail = sgMail;
    }
}

module.exports = BotState;

