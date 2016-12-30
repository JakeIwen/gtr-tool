/*! firebase-admin v4.0.4
    https://firebase.google.com/terms/ */
"use strict";
var url = require('url');
/**
 * Validates that a string is a valid Firebase Auth uid.
 *
 * @param {any} uid The string to validate.
 * @return {boolean} Whether the string is a valid Firebase Auth uid.
 */
function isUid(uid) {
    return typeof uid === 'string' && uid.length > 0 && uid.length <= 128;
}
exports.isUid = isUid;
/**
 * Validates that a string is a valid Firebase Auth password.
 *
 * @param {any} password The password string to validate.
 * @return {boolean} Whether the string is a valid Firebase Auth password.
 */
function isPassword(password) {
    // A password must be a string of at least 6 characters.
    return typeof password === 'string' && password.length >= 6;
}
exports.isPassword = isPassword;
/**
 * Validates that a string is a valid email.
 *
 * @param {any} email The string to validate.
 * @return {boolean} Whether the string is valid email or not.
 */
function isEmail(email) {
    if (typeof email !== 'string') {
        return false;
    }
    // There must at least one character before the @ symbol and another after.
    var re = /^[^@]+@[^@]+$/;
    return re.test(email);
}
exports.isEmail = isEmail;
/**
 * Validates that a string is a valid web URL.
 *
 * @param {any} urlStr The string to validate.
 * @return {boolean} Whether the string is valid web URL or not.
 */
function isURL(urlStr) {
    if (typeof urlStr !== 'string') {
        return false;
    }
    // Lookup illegal characters.
    var re = /[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\.\-\_\~\%]/i;
    if (re.test(urlStr)) {
        return false;
    }
    try {
        var uri = url.parse(urlStr);
        var scheme = uri.protocol;
        var slashes = uri.slashes;
        var hostname = uri.hostname;
        var pathname = uri.pathname;
        if ((scheme !== 'http:' && scheme !== 'https:') || !slashes) {
            return false;
        }
        // Validate hostname: Can contain letters, numbers, underscore and dashes separated by a dot.
        // Each zone must not start with a hyphen or underscore.
        if (!/^[a-zA-Z0-9]+[\w\-]*([\.]?[a-zA-Z0-9]+[\w\-]*)*$/.test(hostname)) {
            return false;
        }
        // Allow for pathnames: (/chars+)*
        // Where chars can be a combination of: a-z A-Z 0-9 - _ . ~ ! $ & ' ( ) * + , ; = : @
        var pathnameRe = /^(\/[\w\-\.\~\!\$\'\(\)\*\+\,\;\=\:\@]+)*$/;
        // Validate pathname.
        if (pathname &&
            pathname !== '/' &&
            !pathnameRe.test(pathname)) {
            return false;
        }
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.isURL = isURL;
