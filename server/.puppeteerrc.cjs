// Store Chrome inside the project directory so Render's build cache carries it
// from `npm install` (build) to runtime. Without this, Puppeteer downloads Chrome
// to a home-dir cache that Render wipes, and every scan fails with
// "Could not find Chrome".
const { join } = require('path');

module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
