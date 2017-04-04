var admin = require("firebase-admin");

var fs = require("fs");
fs.stat('./server/firebase-service.json', function(err, stat) {
    if(err == null) {
      admin.initializeApp({
        credential: admin.credential.cert("./server/firebase-service.json"),
        databaseURL: "https://gtr-tool.firebaseio.com"
      });
    } else if(err.code == 'ENOENT') {
      admin.initializeApp({
        credential: admin.credential.cert({
          "type": process.env.FIREBASE_TYPE,
          "project_id": process.env.FIREBASE_PROJECT_ID,
          "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
          "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          "client_email": process.env.FIREBASE_CLIENT_EMAIL,
          "client_id": process.env.FIREBASE_CLIENT_ID,
          "auth_uri": process.env.FIREBASE_AUTH_URI,
          "token_uri": process.env.FIREBASE_TOKEN_URI,
          "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
          "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
        }),
        databaseURL: "https://gtr-tool.firebaseio.com"
      });
    } else {
        console.log('forebase admin data unavailable: ', err.code);
    }
});

var tokenDecoder = function(req, res, next){
  if (req.headers.id_token) {
    admin.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
      // Adding the decodedToken to the request so that downstream processes can use it
      req.decodedToken = decodedToken;
      next();
    })
    .catch(function(error) {
      console.log('User token could not be verified');
      res.sendStatus(403);
    });
  } else {
    // Seems to be hit when chrome makes request for map files
    // Will also be hit when user does not send back an idToken in the header
    res.sendStatus(403);
  }
};

module.exports = { token: tokenDecoder };
