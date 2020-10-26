const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/secrets')

module.exports = (user) => {
    const payload = {
        username: user.username
      };
    
      const options = {
        expiresIn: '1d'
      };
    console.log("signToken")
    
      return jwt.sign(payload, jwtSecret, options);
};
