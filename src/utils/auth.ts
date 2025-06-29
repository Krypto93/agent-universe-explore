import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';

// Signup control flag - set to false to disable signups
export const isSignUpEnabled = false;

const poolData = {
  UserPoolId: 'ap-south-1_sqEUfZgsE',     // e.g., us-east-1_xxxxx
  ClientId: '4vafb9khr72r3uuferi6ts166'           // e.g., xxxxxxxx
};

const userPool = new CognitoUserPool(poolData);

// Sign Up
export const signUp = (email: string, password: string, firstName: string, lastName: string) => {
  return new Promise((resolve, reject) => {
    const attributes = [
      new CognitoUserAttribute({ Name: 'given_name', Value: firstName }),
      new CognitoUserAttribute({ Name: 'family_name', Value: lastName }),
      new CognitoUserAttribute({ Name: 'email', Value: email })
    ];

    userPool.signUp(email, password, attributes, [], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const confirmSignUp = (email: string, code: string): Promise<any> => {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Log In
export const signIn = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        const token = result.getIdToken().getJwtToken();
        resolve(token);
      },
      onFailure: (err) => reject(err)
    });
  });
};