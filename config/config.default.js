/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {
    env: 'xx',
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1596353041082_475';

  // add your middleware config here
  config.middleware = ['koaStatic', 'ssrRender'];
  // config.middleware = ['koaStatic'];

  config.ssrRender = {
    title: 'eminoda blog',
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
