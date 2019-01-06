const fs = require('fs');
const path = require('path');
const createConfig = require('../createConfig');
const files = fs
  .readdirSync(path.resolve(__dirname, 'src'))
  .filter(filename => filename.endsWith('.js'))
  .map(filename => filename.slice(0, filename.length - 3));

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
