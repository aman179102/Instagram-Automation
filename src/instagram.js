const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');
const path = require('path');
const utilities = require('./utils');

/**
 * Instagram posting functionality
 */
class InstagramPoster {
  constructor() {
    this.ig = new IgApiClient();
    this.sessionPath = path.join(process.cwd(), 'ig-session.json');
  }

  /**
   * Initialize Instagram client and handle authentication
   */
  async initialize() {
    this.ig.state.generateDevice(process.env.INSTA_USERNAME);

    try {
      // Try to restore previous session
      if (fs.existsSync(this.sessionPath)) {
        const savedSession = JSON.parse(fs.readFileSync(this.sessionPath, 'utf8'));
        await this.ig.state.deserialize(savedSession);
        utilities.logToFile('✅ Restored previous Instagram session');
      } else {
        utilities.logToFile('🔐 Logging in...');
        await this.ig.account.login(process.env.INSTA_USERNAME, process.env.INSTA_PASSWORD);
        const session = await this.ig.state.serialize();
        delete session.constants;
        fs.writeFileSync(this.sessionPath, JSON.stringify(session));
        utilities.logToFile('✅ Logged in and saved session');
      }
    } catch (error) {
      utilities.logToFile(`❌ Instagram authentication error: ${error.message}`);
      
      // Handle checkpoint required
      if (error.message.includes('checkpoint')) {
        utilities.logToFile('❌ Instagram requires checkpoint verification!');
        if (fs.existsSync(this.sessionPath)) {
          fs.unlinkSync(this.sessionPath);
        }
      }
      throw error;
    }
  }

  /**
   * Generate a random caption for the meme post
   * @returns {string} Random caption
   */
  generateCaption() {
    const captions = [
      `😂 Daily dose of laughter for you! ${Math.random() > 0.5 ? 'Hope this makes your day better!' : 'Enjoy!'}\n\n` +
      'Credits to original creator 🙏\n' +
      '#memes #funny #viral #trending #comedy #lol #memesdaily #indianmemes #desimemes #fun',
      
      `🤣 Just found this gem! ${Math.random() > 0.5 ? 'Couldn\'t stop laughing!' : 'Too relatable!'}\n\n` +
      'Credit to the creator 👍\n' +
      '#funny #memes #viral #trending #laugh #comedy #indianmemes #desimemes #dankmemes',

      `😄 Sharing some good vibes! ${Math.random() > 0.5 ? 'Hope this brightens your day!' : 'Enjoy the laugh!'}\n\n` +
      'All credits to the original creator ✨\n' +
      '#memes #humor #viral #trending #funny #comedy #dailymemes #laugh #entertainment'
    ];

    return captions[Math.floor(Math.random() * captions.length)];
  }

  /**
   * Post an image to Instagram
   * @param {string} imagePath - Path to the image file
   */
  async postImage(imagePath) {
    try {
      const caption = this.generateCaption();

      utilities.logToFile('📤 Uploading post...');
      await utilities.randomDelay();
      
      // Upload the photo
      await this.ig.publish.photo({
        file: await fs.promises.readFile(imagePath),
        caption: caption,
      });

      utilities.logToFile('✅ Post successful!');
      await utilities.delay(10000);

    } catch (error) {
      utilities.logToFile(`❌ Instagram posting error: ${error.message}`);
      
      // Handle checkpoint required
      if (error.message.includes('checkpoint')) {
        utilities.logToFile('❌ Instagram requires checkpoint verification!');
        if (fs.existsSync(this.sessionPath)) {
          fs.unlinkSync(this.sessionPath);
        }
      }
      throw error;
    }
  }
}

module.exports = InstagramPoster;
