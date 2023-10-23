const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
//pool data from aws account
const poolData = {
  UserPoolId: process.env.USER_POOL_ID,
  ClientId: process.env.CLIENT_ID,
};
//global user pool
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
//sign up with email
const signUp = (username, password, attrList) => {
  return new Promise((resolve, reject) => {
    userPool.signUp(username, password, attrList, null, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.user);
      }
    });
  });
};
//verify email
const confirmEmail = (username, code) => {
  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, false, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
//forgot password (send code to reset it)
const forgotPassword = (email) => {
  const userData = {
    Username: email,
    Pool: userPool,
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.forgotPassword({
      onSuccess: () => {
        resolve("success");
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};
//confirm password
const confirmPassword = (email, code, password) => {
  const userData = {
    Username: email,
    Pool: userPool,
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(code, password, {
      onSuccess: () => {
        resolve("success");
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};
//login
const login = (username, password) => {
  const authenticationData = {
    Username: username,
    Password: password,
  };

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );
  const userData = {
    Username: username,
    Pool: userPool,
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        // Authentication successful
        resolve(session);
      },
      onFailure: (err) => {
        // Authentication failed
        reject(err);
      },
    });
  });
};

module.exports = {
  signUp,
  confirmEmail,
  forgotPassword,
  confirmPassword,
  login,
};
