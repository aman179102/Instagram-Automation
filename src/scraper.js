const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const utilities = require('./utils');

// Add stealth plugin
puppeteer.use(StealthPlugin());

/**
 * Keywords for different meme categories
 */
const HINGLISH_KEYWORDS = [
  'desi%20memes',
  'indian%20memes',
  'hinglish%20memes',
  'hindi%20memes',
  'aaj%20ka%20trending%20meme'
];

/**
 * Scrape copyright-safe memes from Pinterest
 * @param {string} keyword - Search keyword for memes
 * @returns {Promise<string>} URL of selected meme
 */
async function getSafeMeme(keyword = 'funny%20memes') {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
      '--remote-debugging-port=9222',
      '--remote-debugging-address=0.0.0.0'
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath()
  });

  let retries = 3;
  let page;
  
  while (retries > 0) {
    try {
      page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1280, height: 800 });

      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
      });

      utilities.logToFile(`Loading Pinterest for keyword: ${keyword}`);
      await page.goto(`https://www.pinterest.com/search/pins/?q=${keyword}&rs=typed`, {
        waitUntil: 'networkidle2',
        timeout: 120000
      });

      utilities.logToFile('Page loaded, scrolling...');
      await utilities.randomDelay();

      // Scroll multiple times to load more content
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, 1500));
        await utilities.delay(2000);
      }

      const memeUrls = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img'))
          .map(img => {
            let src = img.src;
            // Improve image quality by getting original size
            if (src.includes('/236x/')) src = src.replace('/236x/', '/originals/');
            else if (src.includes('/474x/')) src = src.replace('/474x/', '/originals/');
            else if (src.includes('/736x/')) src = src.replace('/736x/', '/originals/');
            return src;
          })
          .filter(src =>
            src.startsWith('https://i.pinimg.com/originals/') &&
            /\.(jpg|jpeg|png)$/i.test(src)
          );
      });

      if (!memeUrls.length) throw new Error('No copyright-safe memes found');
      
      const selectedUrl = memeUrls[Math.floor(Math.random() * memeUrls.length)];
      utilities.logToFile(`Selected meme URL: ${selectedUrl}`);
      return selectedUrl;

    } catch (error) {
      utilities.logToFile(`Attempt ${4-retries} failed: ${error.message}`);
      retries--;
      if (retries === 0) throw error;
      await utilities.delay(10000);
    } finally {
      if (page) await page.close();
      await browser.close();
    }
  }
}

/**
 * Get a random keyword for meme search
 * @returns {Object} Object containing keyword and type
 */
function getRandomKeyword() {
  const useHinglish = Math.random() > 0.5;
  const keyword = useHinglish 
    ? HINGLISH_KEYWORDS[Math.floor(Math.random() * HINGLISH_KEYWORDS.length)]
    : 'funny%20memes';
  
  return { keyword, type: useHinglish ? 'Hinglish' : 'English' };
}

module.exports = {
  getSafeMeme,
  getRandomKeyword,
  HINGLISH_KEYWORDS
};
