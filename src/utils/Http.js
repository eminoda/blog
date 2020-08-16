import axios from 'axios';

function Http(options) {
  const defaultOptions = {
    method: 'get',
    baseURL: 'http://127.0.0.1:7001/api',
  };
  this.options = Object.assign(defaultOptions, options);
  this.axios = axios.create(this.options);

  // Add a request interceptor
  this.axios.interceptors.request.use(
    function(config) {
      if (config.method == 'get') {
        config.params = config.data;
      }
      // Do something before request is sent
      return config;
    },
    function(error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  this.axios.interceptors.response.use(
    function(response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response.data.data;
    },
    function(error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );
  this.request = function({ url, data, method }) {
    return this.axios.request({ url, data, method });
  };
}
export default Http;
