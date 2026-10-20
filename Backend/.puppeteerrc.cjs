const { join } = require("path");

/**
 * Store the downloaded Chrome inside the project so it is still there
 * when the server starts on the hosting platform.
 */
module.exports = {
    cacheDirectory: join(__dirname, ".cache", "puppeteer")
};
