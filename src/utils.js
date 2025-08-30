const fs = require('fs');

/**
 * Utility functions for the Instagram Meme Bot
 */
const utilities = {
  /**
   * Create a delay for the specified number of milliseconds
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after the delay
   */
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Create a random delay between 3-8 seconds
   * @returns {Promise} Promise that resolves after random delay
   */
  randomDelay: () => utilities.delay(3000 + Math.random() * 5000),

  /**
   * Log message to both console and file
   * @param {string} message - Message to log
   */
  logToFile: (message) => {
    const logEntry = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFileSync('bot.log', logEntry);
    console.log(message);
  },

  /**
   * Clean up temporary files
   * @param {string} filePath - Path to file to clean up
   */
  cleanupFile: (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, () => {});
    }
  }
};

module.exports = utilities;
