'use strict';
// Store things necessary to maintain bot state

class BotState {
    /* Constructor
     * @param client discord.js Client object
     * @param keyv Keyv object
     * @param sgClient SendGrid client object
     */
    constructor(client, keyv, sgClient) {
        this.client = client;
        this.keyv = keyv;
        this.sgClient = sgClient;
    }
}

module.exports = BotState;

