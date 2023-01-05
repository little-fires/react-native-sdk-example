const path = require('path');
const pak = require('./plugins/littlefires/package.json');

module.exports = {
  dependencies: {
    [pak.name]: {
      root: path.join(__dirname, 'plugins', 'littlefires'),
    },
  },
};
