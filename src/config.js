const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Configuration management for the Instagram Meme Bot
 */
class ConfigManager {
  constructor() {
    this.envPath = path.join(process.cwd(), '.env');
  }

  /**
   * Create readline interface for user input
   */
  createInterface() {
    return readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Prompt user for input
   * @param {string} question - Question to ask
   * @param {boolean} hidden - Whether to hide input (for passwords)
   */
  async prompt(question, hidden = false) {
    const rl = this.createInterface();
    
    return new Promise((resolve) => {
      if (hidden) {
        // Hide password input
        rl.stdoutMuted = true;
        rl._writeToOutput = function _writeToOutput(stringToWrite) {
          if (rl.stdoutMuted) {
            rl.output.write('*');
          } else {
            rl.output.write(stringToWrite);
          }
        };
      }

      rl.question(question, (answer) => {
        rl.close();
        if (hidden) console.log(); // New line after hidden input
        resolve(answer.trim());
      });
    });
  }

  /**
   * Interactive setup of environment variables
   */
  async setupConfig() {
    console.log('🔧 Instagram Meme Bot Configuration Setup\n');
    
    const config = {};

    // Instagram credentials
    config.INSTA_USERNAME = await this.prompt('Instagram Username: ');
    config.INSTA_PASSWORD = await this.prompt('Instagram Password: ', true);
    
    // Optional Puppeteer path
    const customPath = await this.prompt('Custom Puppeteer/Chrome path (press Enter to skip): ');
    if (customPath) {
      config.PUPPETEER_EXECUTABLE_PATH = customPath;
    }

    // Write to .env file
    const envContent = Object.entries(config)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(this.envPath, envContent);
    console.log('\n✅ Configuration saved to .env file');
    console.log('🚀 You can now run: npx instagram-meme-bot run');
  }

  /**
   * Check if configuration exists and is valid
   */
  validateConfig() {
    if (!fs.existsSync(this.envPath)) {
      return { valid: false, message: '.env file not found. Run: npx instagram-meme-bot config' };
    }

    // Load environment variables
    require('dotenv').config();

    if (!process.env.INSTA_USERNAME || !process.env.INSTA_PASSWORD) {
      return { valid: false, message: 'Instagram credentials missing in .env file' };
    }

    return { valid: true };
  }
}

module.exports = ConfigManager;
