'use strict';

// Store verification data of user
class VerificationUser {

    constructor() {
        this.userid = null;
        this.email = null;
        this.verified = null;
        this.verification_code = null;
        this.verification_code_ttl = null;
    }

    setUserId(userid) {
        this.userid = userid;
        return this;
    }

    setEmail(email) {
        this.email = email;
        return this;
    }
    // todo finish implementation of user object and store this shit in the database
}
