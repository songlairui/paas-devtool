const path = require('path');
const createConfig = require('../createConfig');

const files = [
  'hook',
  'devtools',
  'background',
  'devtools-background',
  'backend',
  'proxy',
  'detector'
];
module.exports = createConfig({
  entry: files.reduce(
    (result, file) => ((result[file] = `./src/${file}.js`), result),
    {}
  ),
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  devtool: process.env.NODE_ENV !== 'production' ? '#inline-source-map' : false
});
