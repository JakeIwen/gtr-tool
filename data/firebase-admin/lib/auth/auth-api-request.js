/*! firebase-admin v4.0.4
    https://firebase.google.com/terms/ */
"use strict";
var validator = require('../utils/validator');
var deep_copy_1 = require('../utils/deep-copy');
var error_1 = require('../utils/error');
var api_request_1 = require('../utils/api-request');
/** Firebase Auth backend host. */
var FIREBASE_AUTH_HOST = 'www.googleapis.com';
/** Firebase Auth backend port number. */
var FIREBASE_AUTH_PORT = 443;
/** Firebase Auth backend path. */
var FIREBASE_AUTH_PATH = '/identitytoolkit/v3/relyingparty/';
/** Firebase Auth request header. */
var FIREBASE_AUTH_HEADER = {
    'Content-Type': 'application/json',
};
/** Firebase Auth request timeout duration in seconds. */
var FIREBASE_AUTH_TIMEOUT = 10000;
/**
 * Validates a create/edit request object. All unsupported parameters
 * are removed from the original request. If an invalid field is passed
 * an error is thrown.
 *
 * @param {any} request The create/edit request object.
 */
function validateCreateEditRequest(request) {
    // Hash set of whitelisted parameters.
    var validKeys = {
        displayName: true,
        localId: true,
        email: true,
        password: true,
        rawPassword: true,
        emailVerified: true,
        photoUrl: true,
        disabled: true,
        disableUser: true,
        deleteAttribute: true,
        sanityCheck: true,
    };
    // Remove invalid keys from original request.
    for (var key in request) {
        if (!(key in validKeys)) {
            delete request[key];
        }
    }
    // For any invalid parameter, use the external key name in the error description.
    // displayName should be a string.
    if (typeof request.displayName !== 'undefined' &&
        typeof request.displayName !== 'string') {
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_DISPLAY_NAME);
    }
    if (typeof request.localId !== 'undefined' && !validator.isUid(request.localId)) {
        // This is called localId on the backend but the developer specifies this as
        // uid externally. So the error message should use the client facing name.
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_UID);
    }
    // email should be a string and a valid email.
    if (typeof request.email !== 'undefined' && !validator.isEmail(request.email)) {
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_EMAIL);
    }
    // password should be a string and a minimum of 6 chars.
    if (typeof request.password !== 'undefined' &&
        !validator.isPassword(request.password)) {
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PASSWORD);
    }
    // rawPassword should be a string and a minimum of 6 chars.
    if (typeof request.rawPassword !== 'undefined' &&
        !validator.isPassword(request.rawPassword)) {
        // This is called rawPassword on the backend but the developer specifies this as
        // password externally. So the error message should use the client facing name.
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PASSWORD);
    }
    // emailVerified should be a boolean.
    if (typeof request.emailVerified !== 'undefined' &&
        typeof request.emailVerified !== 'boolean') {
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_EMAIL_VERIFIED);
    }
    // photoUrl should be a URL.
    if (typeof request.photoUrl !== 'undefined' &&
        !validator.isURL(request.photoUrl)) {
        // This is called photoUrl on the backend but the developer specifies this as
        // photoURL externally. So the error message should use the client facing name.
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PHOTO_URL);
    }
    // disabled should be a boolean.
    if (typeof request.disabled !== 'undefined' &&
        typeof request.disabled !== 'boolean') {
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_DISABLED_FIELD);
    }
    // disableUser should be a boolean.
    if (typeof request.disableUser !== 'undefined' &&
        typeof request.disableUser !== 'boolean') {
        // This is called disableUser on the backend but the developer specifies this as
        // disabled externally. So the error message should use the client facing name.
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_DISABLED_FIELD);
    }
}
;
/** Instantiates the getAccountInfo endpoint settings. */
exports.FIREBASE_AUTH_GET_ACCOUNT_INFO = new api_request_1.ApiSettings('getAccountInfo', 'POST')
    .setRequestValidator(function (request) {
    if (!request.localId && !request.email) {
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Server request is missing user identifier');
    }
})
    .setResponseValidator(function (response) {
    if (!response.users) {
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.USER_NOT_FOUND);
    }
});
/** Instantiates the deleteAccount endpoint settings. */
exports.FIREBASE_AUTH_DELETE_ACCOUNT = new api_request_1.ApiSettings('deleteAccount', 'POST')
    .setRequestValidator(function (request) {
    if (!request.localId) {
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Server request is missing user identifier');
    }
});
/** Instantiates the setAccountInfo endpoint settings for updating existing accounts. */
exports.FIREBASE_AUTH_SET_ACCOUNT_INFO = new api_request_1.ApiSettings('setAccountInfo', 'POST')
    .setRequestValidator(function (request) {
    // localId is a required parameter.
    if (typeof request.localId === 'undefined') {
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Server request is missing user identifier');
    }
    validateCreateEditRequest(request);
})
    .setResponseValidator(function (response) {
    // If the localId is not returned, then the request failed.
    if (!response.localId) {
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.USER_NOT_FOUND);
    }
});
/**
 * Instantiates the uploadAccount endpoint settings for creating a new user with uid
 * specified.
 */
exports.FIREBASE_AUTH_UPLOAD_ACCOUNT = new api_request_1.ApiSettings('uploadAccount', 'POST')
    .setRequestValidator(function (request) {
    var validKeys = {
        users: true,
        // Required to throw an error when a user already exists with the provided uid.
        allowOverwrite: true,
        // Required to throw an error if the email is already in use by another account.
        sanityCheck: true,
    };
    // Remove unsupported properties.
    for (var key in request) {
        if (!(key in validKeys)) {
            delete request[key];
        }
    }
    // Required uploadAccount parameter.
    if (typeof request.users === 'undefined' ||
        request.users == null ||
        !request.users.length) {
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid uploadAccount request. No users provider.');
    }
    // Validate each user within users.
    for (var _i = 0, _a = request.users; _i < _a.length; _i++) {
        var user = _a[_i];
        // localId is a required parameter.
        if (typeof user.localId === 'undefined') {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Server request is missing user identifier');
        }
        // Validate user.
        validateCreateEditRequest(user);
    }
})
    .setResponseValidator(function (response) {
    // Return the first error. UploadAccount is used to upload multiple accounts.
    // If an error occurs in any account to be upload, an array of errors is
    // returned.
    if (typeof response.error !== 'undefined' &&
        response.error.length &&
        typeof response.error[0].message === 'string') {
        // Get error description.
        if (response.error[0].message.indexOf('can not overwrite') !== -1) {
            // Duplicate user error
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.UID_ALREADY_EXISTS, response.error[0].message);
        }
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: ' + response.error[0].message);
    }
});
/**
 * Instantiates the signupNewUser endpoint settings for creating a new user without
 * uid being specified. The backend will create a new one and return it.
 */
exports.FIREBASE_AUTH_SIGN_UP_NEW_USER = new api_request_1.ApiSettings('signupNewUser', 'POST')
    .setRequestValidator(function (request) {
    // localId should not be specified.
    // This should not occur as when the uid is provided, uploadAccount is used instead.
    if (typeof request.localId !== 'undefined') {
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: User identifier must not be specified');
    }
    validateCreateEditRequest(request);
})
    .setResponseValidator(function (response) {
    // If the localId is not returned, then the request failed.
    if (!response.localId) {
        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to create new user');
    }
});
/**
 * Class that provides mechanism to send requests to the Firebase Auth backend endpoints.
 *
 * @param {Credential} credential The service account credential used to sign HTTP requests.
 * @constructor
 */
var FirebaseAuthRequestHandler = (function () {
    function FirebaseAuthRequestHandler(credential) {
        this.host = FIREBASE_AUTH_HOST;
        this.port = FIREBASE_AUTH_PORT;
        this.path = FIREBASE_AUTH_PATH;
        this.headers = FIREBASE_AUTH_HEADER;
        this.timeout = FIREBASE_AUTH_TIMEOUT;
        this.signedApiRequestHandler = new api_request_1.SignedApiRequestHandler(credential);
    }
    /**
     * @param {Object} response The response to check for errors.
     * @return {string} The error code if present, an empty string otherwise.
     */
    FirebaseAuthRequestHandler.getErrorCode = function (response) {
        return (response.error && response.error.message) || null;
    };
    /**
     * Looks a user by uid.
     *
     * @param {string} uid The uid of the user to lookup.
     * @return {Promise<Object>} A promise that resolves with the user information.
     */
    FirebaseAuthRequestHandler.prototype.getAccountInfoByUid = function (uid) {
        var request = {
            localId: [uid],
        };
        return this.invokeRequestHandler(exports.FIREBASE_AUTH_GET_ACCOUNT_INFO, request);
    };
    /**
     * Looks a user by email.
     *
     * @param {string} email The email of the user to lookup.
     * @return {Promise<Object>} A promise that resolves with the user information.
     */
    FirebaseAuthRequestHandler.prototype.getAccountInfoByEmail = function (email) {
        var request = {
            email: [email],
        };
        return this.invokeRequestHandler(exports.FIREBASE_AUTH_GET_ACCOUNT_INFO, request);
    };
    /**
     * Deletes an account identified by a uid.
     *
     * @param {string} uid The uid of the user to delete.
     * @return {Promise<Object>} A promise that resolves when the user is deleted.
     */
    FirebaseAuthRequestHandler.prototype.deleteAccount = function (uid) {
        var request = {
            localId: uid,
        };
        return this.invokeRequestHandler(exports.FIREBASE_AUTH_DELETE_ACCOUNT, request);
    };
    /**
     * Edits an existing user.
     *
     * @param {string} uid The user to edit.
     * @param {Object} properties The properties to set on the user.
     * @return {Promise<string>} A promise that resolves when the operation completes
     *     with the user id that was edited.
     */
    FirebaseAuthRequestHandler.prototype.updateExistingAccount = function (uid, properties) {
        // Build the setAccountInfo request.
        var request = deep_copy_1.deepCopy(properties);
        request.localId = uid;
        // For deleting displayName or photoURL, these values must be passed as null.
        // They will be removed from the backend request and an additional parameter
        // deleteAttribute: ['PHOTO_URL', 'DISPLAY_NAME']
        // with an array of the parameter names to delete will be passed.
        // Parameters that are deletable and their deleteAttribute names.
        // Use client facing names, photoURL instead of photoUrl.
        var deletableParams = {
            displayName: 'DISPLAY_NAME',
            photoURL: 'PHOTO_URL',
        };
        // Properties to delete if available.
        request.deleteAttribute = [];
        for (var key in deletableParams) {
            if (request[key] === null) {
                // Add property identifier to list of attributes to delete.
                request.deleteAttribute.push(deletableParams[key]);
                // Remove property from request.
                delete request[key];
            }
        }
        if (request.deleteAttribute.length === 0) {
            delete request.deleteAttribute;
        }
        // Rewrite photoURL to photoUrl.
        if (typeof request.photoURL !== 'undefined') {
            request.photoUrl = request.photoURL;
            delete request.photoURL;
        }
        // Rewrite disabled to disableUser.
        if (typeof request.disabled !== 'undefined') {
            request.disableUser = request.disabled;
            delete request.disabled;
        }
        return this.invokeRequestHandler(exports.FIREBASE_AUTH_SET_ACCOUNT_INFO, request)
            .then(function (response) {
            return response.localId;
        });
    };
    /**
     * Create a new user with the properties supplied.
     *
     * @param {Object} properties The properties to set on the user.
     * @return {Promise<string>} A promise that resolves when the operation completes
     *     with the user id that was created.
     */
    FirebaseAuthRequestHandler.prototype.createNewAccount = function (properties) {
        // Build the signupNewUser/uploadAccount request.
        var request = deep_copy_1.deepCopy(properties);
        var finalRequest;
        var apiSettings;
        // Rewrite photoURL to photoUrl.
        if (typeof request.photoURL !== 'undefined') {
            request.photoUrl = request.photoURL;
            delete request.photoURL;
        }
        if (typeof request.uid !== 'undefined') {
            request.localId = request.uid;
            // If uid specified, use uploadAccount endpoint.
            apiSettings = exports.FIREBASE_AUTH_UPLOAD_ACCOUNT;
            // This endpoint takes a hashed password.
            // To pass a plain text password, pass it via rawPassword field.
            if (typeof request.password !== 'undefined') {
                request.rawPassword = request.password;
                delete request.password;
            }
            // Construct uploadAccount request.
            finalRequest = {
                users: [request],
                // Do not overwrite existing users.
                allowOverwrite: false,
                // Do not allow duplicate emails.
                // This will force the backend to throw an error when an email is
                // already in use by another existing account.
                sanityCheck: true,
            };
        }
        else {
            // If uid not specified, use signupNewUser endpoint.
            apiSettings = exports.FIREBASE_AUTH_SIGN_UP_NEW_USER;
            finalRequest = request;
        }
        return this.invokeRequestHandler(apiSettings, finalRequest)
            .then(function (response) {
            // Return the user id. It is returned in the setAccountInfo and signupNewUser
            // endpoints but not the uploadAccount endpoint. In that case return the same
            // one in request.
            return (response.localId || request.localId);
        });
    };
    /**
     * Invokes the request handler based on the API settings object passed.
     *
     * @param {ApiSettings} apiSettings The API endpoint settings to apply to request and response.
     * @param {Object} requestData The request data.
     * @return {Promise<Object>} A promise that resolves with the response.
     */
    FirebaseAuthRequestHandler.prototype.invokeRequestHandler = function (apiSettings, requestData) {
        var _this = this;
        var path = this.path + apiSettings.getEndpoint();
        var httpMethod = apiSettings.getHttpMethod();
        return Promise.resolve()
            .then(function () {
            // Validate request.
            var requestValidator = apiSettings.getRequestValidator();
            requestValidator(requestData);
            // Process request.
            return _this.signedApiRequestHandler.sendRequest(_this.host, _this.port, path, httpMethod, requestData, _this.headers, _this.timeout);
        })
            .then(function (response) {
            // Check for backend errors in the response.
            var errorCode = FirebaseAuthRequestHandler.getErrorCode(response);
            if (errorCode) {
                throw error_1.FirebaseAuthError.fromServerError(errorCode);
            }
            // Validate response.
            var responseValidator = apiSettings.getResponseValidator();
            responseValidator(response);
            // Return entire response.
            return response;
        });
    };
    return FirebaseAuthRequestHandler;
}());
exports.FirebaseAuthRequestHandler = FirebaseAuthRequestHandler;
