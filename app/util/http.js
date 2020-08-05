const axios = require('axios');

class Http {
  constructor(options) {
    this.axios = axios.create({
      baseURL: '',
      timeout: 30 * 1000,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
    this.axios.interceptors.response.use(
      function(response) {
        return response.data;
      },
      function(error) {
        return Promise.reject(error);
      }
    );
  }
  request(config) {
    return this.axios(config);
  }
}
module.exports = Http;
