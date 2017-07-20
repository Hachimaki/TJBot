const con = require('./con');
const request = require('request');

function message(inputText) {
  // const config = require('./config');
  // const messageText = inputText || 'hello';

  // this._responseContext = {...this._responseContext, ...context};
  // TODO: Update as needed for user information (i.e. user id, passed API/auth keys, etc.)
  const payload = {
    id: 'TJBot',
    version: '1.0',
    language: 'en-US',
    text: inputText || 'hello',

    // context: this._responseContext
    context: {
      user: {
        id: 'user-f4c',
      },
      application: {
        id: 'application-l4c',
        attributes: {},
      },
    },
  };

  console.log('request', payload);
  // return apiGatewayRequest(`${config.saganRoot}`, {
  // request.post(payload);

  return new Promise((resolve, reject) => {
    request({
      uri: con.uri,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(payload),
    },
      (err, res, body) => {
        if (err) {
          reject(err);
        }

        resolve(body);
      }
    );
  });
}

module.exports.message = message;
// module.exports.SaganService = SaganService;

// export default SaganService;
