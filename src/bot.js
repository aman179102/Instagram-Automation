const axios = require('axios');
const fs = require('fs');
const path = require('path');
const utilities = require('./utils');
const { getSafeMeme, getRandomKeyword } = require('./scraper');
const InstagramPoster = require('./instagram');

/**
 * Main bot class that orchestrates meme scraping and posting
 */
class MemeBotCore {
  constructor() {
    this.instagramPoster = new InstagramPoster();
  }

  /**
   * Initialize the bot
   */
  async initialize() {
    await this.instagramPoster.initialize();
  }

  /**
   * Download an image from URL
   * @param {string} url - Image URL
   * @param {string} filepath - Local file path to save
   */
  async downloadImage(url, filepath) {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 30000
    });

    return new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(filepath))
        .on('finish', resolve)
        .on('error', reject);
    });
  }

  /**
   * Run a single cycle of the bot (scrape and post)
   */
  async runCycle() {
    let tempFile;
    try {
      // Get random keyword and scrape meme
      const { keyword, type } = getRandomKeyword();
      utilities.logToFile(`🔍 Finding a ${type} meme...`);
      utilities.logToFile(`🔍 Searching Pinterest for: ${decodeURIComponent(keyword)}`);
      
      const memeUrl = await getSafeMeme(keyword);
      utilities.logToFile(`📌 Selected meme: ${memeUrl}`);

      // Download the image
      tempFile = path.join(process.cwd(), `meme_${Date.now()}.jpg`);
      await this.downloadImage(memeUrl, tempFile);

      utilities.logToFile('📤 Posting to Instagram...');
      await this.instagramPoster.postImage(tempFile);

    } catch (error) {
      utilities.logToFile(`❌ Bot cycle error: ${error.message}`);
      
      // Handle rate limits
      if (error.message.includes('rate limit') || error.message.includes('too many')) {
        const waitHours = 1 + Math.random() * 2; // 1-3 hours
        utilities.logToFile(`⏳ Rate limited, waiting ${waitHours.toFixed(1)} hours...`);
        await utilities.delay(waitHours * 60 * 60 * 1000);
      }
      // Handle Puppeteer connection errors
      else if (error.message.includes('Protocol error') || error.message.includes('Connection closed')) {
        const waitHours = 3 + Math.random() * 2; // 3-5 hours
        utilities.logToFile(`⚠️ Cloud environment error, waiting ${waitHours.toFixed(1)} hours...`);
        await utilities.delay(waitHours * 60 * 60 * 1000);
      }
      
      throw error;
    } finally {
      // Clean up downloaded file
      utilities.cleanupFile(tempFile);
    }
  }

  /**
   * Run the bot continuously
   */
  async runContinuous() {
    utilities.logToFile('🚀 Starting Instagram Meme Bot');
    
    while (true) {
      try {
        await this.runCycle();
        
        // Random delay between posts (40-120 minutes)
        const delayInMinutes = Math.floor(Math.random() * 81) + 40;
        utilities.logToFile(`🕒 Waiting ${delayInMinutes} minutes before next post...`);
        await utilities.delay(delayInMinutes * 60 * 1000);
        
      } catch (error) {
        utilities.logToFile(`💥 Fatal error: ${error.message}`);
        // Wait 3 hours if fatal error occurs
        await utilities.delay(3 * 60 * 60 * 1000);
      }
    }
  }
}

module.exports = MemeBotCore;
