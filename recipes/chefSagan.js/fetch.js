class fetch {
  constructor() {
    const COMMON_API_GATEWAY_HEADERS = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    this.COMMON_API_GATEWAY_HEADERS = COMMON_API_GATEWAY_HEADERS;
  }

  checkResponseStatus(response) {
    if (response.status === 200) {
      return response;
    }

    console.log('FetchError: ', response.statusText);
    const error = new Error('Request failed');
    error.response = response;
    throw error;
  }

  apiGatewayRequest(url, options) {
    const requesturl = `${url}`;
    return fetch(requesturl, options)
      .then(this.checkResponseStatus)
      .then(response => response.json());
  }
}

module.exports.fetch = fetch;
