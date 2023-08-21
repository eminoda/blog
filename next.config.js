/** @type {import('next').NextConfig} */

const path = require("path");
const fs = require("fs");
const { alioss } = require("./project.config");
const { execFile } = require("child_process");

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  env: {
    alioss,
  },
  webpack: (config, { webpack, isServer, nextRuntime }) => {
    console.log(isServer, nextRuntime);
    if (isServer) {
      // https://github.com/aws-amplify/amplify-js/issues/11030
      // The issue is caused by Next.js/Webpack warning on require being called with an expression, which is valid in Node.js environment.
      // https://github.com/kevinbeaty/any-promise/issues/28#issuecomment-344953738
      config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^proxy-agent$/ }));
      config.externals.push({
        "any-promise": "var Promise",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
