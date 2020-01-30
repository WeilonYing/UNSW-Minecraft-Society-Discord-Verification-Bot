'use strict';

// Store verification data of user
class VerificationUser {

    constructor() {
        this.userid = null; // string
        this.email = null; // string
        this.verified = false; // boolean
        this.verification_code = null; // string
        this.verification_code_expiry_datetime = null; // number; the number of milliseconds since 1970-1-1
    }

    /* Set user id
     * @param userid discord.js User id
     * @return this object
     */
    setUserId(userid) {
        this.userid = userid;
        return this;
    }

    /* Set email address
     * @param email string representing the email address
     * @return this object
     */
    setEmail(email) {
        this.email = email;
        return this;
    }
    // todo finish implementation of user object and store this shit in the database

    /* Set verification code
     * @param verification_code string
     * @param ttl time in milliseconds that the verification code is valid for, starting
     *      from the time this function was called
     * @return this object
     */
    setVerificationCode(verification_code, ttl) {
        this.verification_code = verification_code;
        const now = new Date().getTime();
        this.verification_code_expiry_datetime = now + ttl;
    }

    /* Reset verification code and its expiry time */
    resetVerificationCode() {
        this.verification_code = null;
        this.verification_code_expiry_datetime = null;
    }

    /* Check verification code and that it was passed in before
     * the expired time
     * @param code the verification code to check against
     * @return boolean true if code matches and entered before expiry time, false otherwise
     */
    checkVerificationCode(code) {
        const now = new Date().getTime();
        if (!this.verification_code_expiry_datetime || this.verification_code_expiry_datetime < now) {
            this.resetVerificationCode();
            return false;
        }
        return this.verification_code === code;
    }

    /* Convert this into a json object
     * @return string in JSON form
     */
    toJson() {
        const output = {
            "userid": this.userid,
            "email": this.email,
            "verified": this.verified,
            "verification_code": this.verification_code,
            "verification_code_expiry_datetime": this.verification_code_expiry_datetime
        };

        return JSON.stringify(output);
    }

    /* Parse a json string data into this object
     * @param json string
     * @return this object with the json data entered into it
     */
    static fromJson(json) {
        const object = JSON.parse(json);
        const result = new VerificationUser();
        result.userid = object.userid;
        result.email = object.email;
        result.verified = object.verified;
        result.verification_code = object.verification_code;
        result.verification_code_expiry_datetime = object.verification_code_expiry_datetime;

        return result;
    }
}

module.exports = VerificationUser;

