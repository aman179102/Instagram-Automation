# 🤖 Instagram Meme Bot

[![npm version](https://badge.fury.io/js/instagram-meme-bot.svg)](https://badge.fury.io/js/instagram-meme-bot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready automated Instagram meme posting bot that scrapes copyright-safe memes from Pinterest and posts them with intelligent scheduling. Built with Node.js, Puppeteer, and the Instagram Private API.

## ✨ Features

- 🎯 **Smart Meme Scraping**: Finds copyright-safe memes from Pinterest
- 🤖 **Automated Posting**: Posts to Instagram with random, engaging captions
- 🧠 **Human-like Behavior**: Random delays and stealth techniques
- 🌍 **Multi-language Support**: Alternates between English and Hinglish memes
- 🔐 **Session Management**: Persistent Instagram login sessions
- 📱 **CLI Interface**: Easy-to-use command line interface
- 📦 **NPM Package**: Use programmatically in your Node.js projects

## 🚀 Quick Start

### Global Installation

```bash
npm install -g instagram-meme-bot
```

### Using npx (No Installation Required)

```bash
npx instagram-meme-bot config  # Setup credentials
npx instagram-meme-bot run     # Start the bot
```

## 📖 Usage

### CLI Commands

#### Setup Configuration
```bash
instagram-meme-bot config
```
Interactive setup for Instagram credentials and optional Puppeteer settings.

#### Run the Bot
```bash
# Run continuously (recommended)
instagram-meme-bot run

# Run once and exit
instagram-meme-bot run --once
```

#### Check Version
```bash
instagram-meme-bot version
```

### Environment Variables

Create a `.env` file in your project directory:

```env
INSTA_USERNAME=your_instagram_username
INSTA_PASSWORD=your_instagram_password
PUPPETEER_EXECUTABLE_PATH=/path/to/chrome  # Optional
```

## 📚 Programmatic Usage

Use the bot in your Node.js applications:

```javascript
const InstagramMemeBot = require('instagram-meme-bot');

const bot = new InstagramMemeBot();

// Run once
async function postSingleMeme() {
  try {
    await bot.runOnce();
    console.log('Meme posted successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run continuously
async function startBot() {
  try {
    await bot.run(); // Runs indefinitely
  } catch (error) {
    console.error('Bot error:', error.message);
  }
}

// Setup configuration programmatically
async function setupConfig() {
  await bot.setupConfig();
}
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js >= 14.0.0
- Instagram account
- Chrome/Chromium browser (automatically installed with Puppeteer)

### Step-by-Step Setup

1. **Install the package**
   ```bash
   npm install -g instagram-meme-bot
   ```

2. **Configure credentials**
   ```bash
   instagram-meme-bot config
   ```
   
3. **Start the bot**
   ```bash
   instagram-meme-bot run
   ```

### Docker Usage (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

## ⚙️ Configuration Options

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `INSTA_USERNAME` | Instagram username | ✅ | - |
| `INSTA_PASSWORD` | Instagram password | ✅ | - |
| `PUPPETEER_EXECUTABLE_PATH` | Custom Chrome path | ❌ | Auto-detected |

### Bot Behavior

- **Posting Frequency**: 40-120 minutes between posts (randomized)
- **Meme Sources**: Pinterest (copyright-safe images only)
- **Caption Style**: Random engaging captions with proper credits
- **Error Handling**: Automatic retry with exponential backoff

## 🔧 Troubleshooting

### Common Issues

#### Instagram Login Issues
```bash
# Clear saved session and reconfigure
rm ig-session.json
instagram-meme-bot config
```

#### Puppeteer/Chrome Issues
```bash
# Install Chrome dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

#### Rate Limiting
The bot automatically handles Instagram rate limits with intelligent delays. If you encounter frequent rate limits:
- Reduce posting frequency
- Use a dedicated Instagram account
- Ensure your account is in good standing

#### Memory Issues
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 bin/cli.js run
```

### Error Codes

| Error | Cause | Solution |
|-------|-------|----------|
| `checkpoint` | Instagram security check | Complete verification in Instagram app |
| `rate limit` | Too many requests | Wait for automatic retry |
| `Protocol error` | Puppeteer connection issue | Restart bot, check Chrome installation |

## 📁 Project Structure

```
instagram-meme-bot/
├── bin/
│   └── cli.js              # CLI entry point
├── src/
│   ├── index.js            # Main package export
│   ├── bot.js              # Core bot logic
│   ├── instagram.js        # Instagram posting
│   ├── scraper.js          # Pinterest scraping
│   ├── config.js           # Configuration management
│   └── utils.js            # Utility functions
├── test/
│   └── utils.test.js       # Jest tests
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
├── .npmignore              # NPM ignore rules
├── package.json            # Package metadata
├── LICENSE                 # MIT License
└── README.md               # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run linting: `npm run lint`
5. Run tests: `npm test`
6. Commit changes: `git commit -am 'Add feature'`
7. Push to branch: `git push origin feature-name`
8. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This project is for educational purposes only. Please:
- Use responsibly and respect Instagram's Terms of Service
- Don't spam or post inappropriate content
- Give proper credit to original meme creators
- Use a dedicated account for automation

## 🙏 Acknowledgments

- [Puppeteer Extra](https://github.com/berstend/puppeteer-extra) for stealth scraping
- [Instagram Private API](https://github.com/dilame/instagram-private-api) for Instagram integration
- Pinterest for providing a source of creative content

## 📞 Support

- 🐛 [Report Issues](https://github.com/aman179102/Instagram-Automation/issues)
- 💬 [Discussions](https://www.linkedin.com/in/aman-kumar-031005330/)
- 📧 Email: amankk179102@gmail.com

---

**Made with ❤️ by [Aman Kumar](https://github.com/aman179102)**
