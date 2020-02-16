'use strict';
// Store things necessary to maintain bot state

class BotState {
    /* Constructor
     * @param client discord.js Client object
     * @param sgClient SendGrid client object
     * @param request Request module object
     */
    constructor(client, sgClient, request) {
        this.client = client;
        this.sgClient = sgClient;
        this.request = request;
    }
}

module.exports = BotState;

