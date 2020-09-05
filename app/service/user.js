const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
const secretOrPublicKey = 'eminoda_key';

class UserService extends Service {
  setToken(payload) {
    const options = {
      algorithm: 'HS256',
      expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    };
    return jwt.sign(payload, secretOrPublicKey, options);
  }
}
module.exports = UserService;
