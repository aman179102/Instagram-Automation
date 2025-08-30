require('dotenv').config();
const MemeBotCore = require('./bot');
const ConfigManager = require('./config');

/**
 * Main entry point for the Instagram Meme Bot package
 */
class InstagramMemeBot {
  constructor() {
    this.bot = new MemeBotCore();
    this.config = new ConfigManager();
  }

  /**
   * Run the bot once (single cycle)
   */
  async runOnce() {
    const validation = this.config.validateConfig();
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    await this.bot.initialize();
    await this.bot.runCycle();
  }

  /**
   * Run the bot continuously
   */
  async run() {
    const validation = this.config.validateConfig();
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    await this.bot.initialize();
    await this.bot.runContinuous();
  }

  /**
   * Setup configuration interactively
   */
  async setupConfig() {
    await this.config.setupConfig();
  }
}

module.exports = InstagramMemeBot;
