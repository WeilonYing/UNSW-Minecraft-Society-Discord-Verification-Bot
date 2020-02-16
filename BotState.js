'use strict';
// Store things necessary to maintain bot state

class BotState {
    /* Constructor
     * @param client discord.js Client object
     * @param request Request module object
     */
    constructor(client, request) {
        this.client = client;
        this.request = request;
    }
}

module.exports = BotState;

