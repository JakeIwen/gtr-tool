/*! firebase-admin v4.0.4
    https://firebase.google.com/terms/ */
"use strict";
var error_1 = require('../utils/error');
/**
 * Parses a time stamp string or number and returns the corresponding date if valid.
 *
 * @param {any} time The unix timestamp string or number in milliseconds.
 * @return {Date} The corresponding date if valid.
 */
function parseDate(time) {
    try {
        var date = new Date(parseInt(time, 10));
        if (!isNaN(date.getTime())) {
            return date;
        }
    }
    catch (e) {
    }
    return null;
}
/**
 * User metadata class that provides metadata information like user account creation
 * and last sign in time.
 *
 * @param {Object} response The server side response returned from the getAccountInfo
 *     endpoint.
 * @constructor
 */
var UserMetadata = (function () {
    function UserMetadata(response) {
        // Creation date is required.
        this.createdAtInternal = parseDate(response.createdAt);
        if (!this.createdAtInternal) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid metadata response');
        }
        this.lastSignedInAtInternal = parseDate(response.lastLoginAt);
    }
    Object.defineProperty(UserMetadata.prototype, "lastSignedInAt", {
        /** @return {Date} The user's last sign-in date. */
        get: function () {
            return this.lastSignedInAtInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserMetadata.prototype, "createdAt", {
        /** @return {Date} The user's account creation date. */
        get: function () {
            return this.createdAtInternal;
        },
        enumerable: true,
        configurable: true
    });
    /** @return {Object} The plain object representation of the user's metadata. */
    UserMetadata.prototype.toJSON = function () {
        return {
            lastSignedInAt: this.lastSignedInAt,
            createdAt: this.createdAt,
        };
    };
    return UserMetadata;
}());
exports.UserMetadata = UserMetadata;
/**
 * User info class that provides provider user information for different
 * Firebase providers like google.com, facebook.com, password, etc.
 *
 * @param {Object} response The server side response returned from the getAccountInfo
 *     endpoint.
 * @constructor
 */
var UserInfo = (function () {
    function UserInfo(response) {
        // Provider user id and provider id are required.
        if (!response.rawId || !response.providerId) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid user info response');
        }
        this.uidInternal = response.rawId;
        this.displayNameInternal = response.displayName;
        this.emailInternal = response.email;
        this.photoURLInternal = response.photoUrl;
        this.providerIdInternal = response.providerId;
    }
    Object.defineProperty(UserInfo.prototype, "uid", {
        /** @return {string} The provider user id. */
        get: function () {
            return this.uidInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfo.prototype, "displayName", {
        /** @return {string} The provider display name. */
        get: function () {
            return this.displayNameInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfo.prototype, "email", {
        /** @return {string} The provider email. */
        get: function () {
            return this.emailInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfo.prototype, "photoURL", {
        /** @return {string} The provider photo URL. */
        get: function () {
            return this.photoURLInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfo.prototype, "providerId", {
        /** @return {string} The provider Firebase ID. */
        get: function () {
            return this.providerIdInternal;
        },
        enumerable: true,
        configurable: true
    });
    /** @return {Object} The plain object representation of the current provider data. */
    UserInfo.prototype.toJSON = function () {
        return {
            uid: this.uid,
            displayName: this.displayName,
            email: this.email,
            photoURL: this.photoURL,
            providerId: this.providerId,
        };
    };
    return UserInfo;
}());
exports.UserInfo = UserInfo;
/**
 * User record class that defines the Firebase user object populated from
 * the Firebase Auth getAccountInfo response.
 *
 * @param {Object} response The server side response returned from the getAccountInfo
 *     endpoint.
 * @constructor
 */
var UserRecord = (function () {
    function UserRecord(response) {
        // The Firebase user id is required.
        if (!response.localId) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid user response');
        }
        this.uidInternal = response.localId;
        this.emailInternal = response.email;
        this.emailVerifiedInternal = !!response.emailVerified;
        this.displayNameInternal = response.displayName;
        this.photoURLInternal = response.photoUrl;
        // If disabled is not provided, the account is enabled by default.
        this.disabledInternal = response.disabled || false;
        this.metadataInternal = new UserMetadata(response);
        var providerData = response.providerUserInfo || [];
        this.providerDataInternal = [];
        for (var _i = 0, providerData_1 = providerData; _i < providerData_1.length; _i++) {
            var entry = providerData_1[_i];
            this.providerData.push(new UserInfo(entry));
        }
    }
    Object.defineProperty(UserRecord.prototype, "uid", {
        /** @return {string} The Firebase user id corresponding to the current user record. */
        get: function () {
            return this.uidInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserRecord.prototype, "email", {
        /** @return {string} The primary email corresponding to the current user record. */
        get: function () {
            return this.emailInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserRecord.prototype, "emailVerified", {
        /** @return {boolean} Whether the primary email is verified. */
        get: function () {
            return this.emailVerifiedInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserRecord.prototype, "displayName", {
        /** @return {string} The display name corresponding to the current user record. */
        get: function () {
            return this.displayNameInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserRecord.prototype, "photoURL", {
        /** @return {string} The photo URL corresponding to the current user record. */
        get: function () {
            return this.photoURLInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserRecord.prototype, "disabled", {
        /** @return {boolean} Whether the current user is disabled or not. */
        get: function () {
            return this.disabledInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserRecord.prototype, "metadata", {
        /** @return {UserMetadata} The user record's metadata. */
        get: function () {
            return this.metadataInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserRecord.prototype, "providerData", {
        /** @return {UserInfo[]} The list of providers linked to the current record. */
        get: function () {
            return this.providerDataInternal;
        },
        enumerable: true,
        configurable: true
    });
    /** @return {Object} The plain object representation of the user record. */
    UserRecord.prototype.toJSON = function () {
        var json = {};
        json.uid = this.uid;
        json.email = this.email;
        json.emailVerified = this.emailVerified;
        json.displayName = this.displayName;
        json.photoURL = this.photoURL;
        json.disabled = this.disabled;
        // Convert metadata to json.
        json.metadata = this.metadata.toJSON();
        json.providerData = [];
        for (var _i = 0, _a = this.providerData; _i < _a.length; _i++) {
            var entry = _a[_i];
            // Convert each provider data to json.
            json.providerData.push(entry.toJSON());
        }
        return json;
    };
    return UserRecord;
}());
exports.UserRecord = UserRecord;
