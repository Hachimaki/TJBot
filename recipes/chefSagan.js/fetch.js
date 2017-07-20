module.exports.COMMON_API_GATEWAY_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

function checkResponseStatus(response) {
  if (response.status === 200) {
    return response;
  }

  console.log('FetchError: ', response.statusText);
  const error = new Error('Request failed');
  error.response = response;
  throw error;
}

module.exports.apiGatewayRequest = function (url, options) {
  const requesturl = `${url}`;
  return fetch(requesturl, options)
    .then(checkResponseStatus)
    .then(response => response.json());
}
