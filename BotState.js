'use strict';
// Store things necessary to maintain bot state

class BotState {
    /* Constructor
     * @param client discord.js Client object
     * @param keyv Keyv object
     */
    constructor(client, keyv) {
        this.client = client;
        this.keyv = keyv;
    }
}

module.exports = BotState;

