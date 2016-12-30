/*! firebase-admin v4.0.4
    https://firebase.google.com/terms/ */
"use strict";
var auth_1 = require('./auth');
var firebase = require('../default-namespace');
/**
 * Factory function that creates a new auth service.
 * @param {Object} app The app for this service
 * @param {function(Object)} extendApp An extend function to extend the app
 *                                     namespace
 * @return {Auth} The auth service for the specified app.
 */
function serviceFactory(app, extendApp) {
    var auth = new auth_1.Auth(app);
    extendApp({
        INTERNAL: {
            getToken: auth.INTERNAL.getToken.bind(auth.INTERNAL),
            addAuthTokenListener: auth.INTERNAL.addAuthTokenListener.bind(auth.INTERNAL),
            removeAuthTokenListener: auth.INTERNAL.removeAuthTokenListener.bind(auth.INTERNAL),
        },
    });
    return auth;
}
/**
 * Handles app life-cycle events. Initializes auth so listerners and getToken() functions are
 * available to other services immediately.
 *
 * @param {string} event The app event that is occurring.
 * @param {FirebaseApp} app The app for which the app hook is firing.
 */
var appHook = function (event, app) {
    if (event === 'create') {
        // Initializes auth so listeners and getToken() functions are available to other services immediately.
        app.auth();
    }
};
function default_1() {
    return firebase.INTERNAL.registerService('auth', serviceFactory, { Auth: auth_1.Auth }, appHook);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
