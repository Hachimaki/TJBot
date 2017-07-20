import config from './config';
import { apiGatewayRequest, COMMON_API_GATEWAY_HEADERS } from './fetch';

const SaganService = {

  // private vars
  // _responseContext = {};

  message: (inputText) => {
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
    return apiGatewayRequest(`${config.saganRoot}`, {
      method: 'post',
      headers: COMMON_API_GATEWAY_HEADERS,
      body: JSON.stringify(payload),
    })
      .then(r =>
        /*
        const res = JSON.parse(JSON.stringify(r));
        const result = this._updateContext(res);
        this._responseContext = result.context;
        return result;
        */
        r);
  },

  _updateContext: (res) => {
    console.log('response', res);

    return res;
  },
};

export default SaganService;
