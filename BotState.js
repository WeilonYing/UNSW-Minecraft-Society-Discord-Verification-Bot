'use strict';
// Store things necessary to maintain bot state

class BotState {
    /* Constructor
     * @param client discord.js Client object
     * @param keyv Keyv object
     * @param sgClient SendGrid client object
     * @param request Request module object
     */
    constructor(client, keyv, sgClient, request) {
        this.client = client;
        this.keyv = keyv;
        this.sgClient = sgClient;
        this.request = request;
    }
}

module.exports = BotState;

