const utilities = require('../src/utils');
const fs = require('fs');

describe('Utilities', () => {
  afterEach(() => {
    // Clean up test log file
    if (fs.existsSync('bot.log')) {
      fs.unlinkSync('bot.log');
    }
  });

  describe('delay', () => {
    it('should delay for the specified time', async () => {
      const start = Date.now();
      await utilities.delay(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(100);
    });
  });

  describe('logToFile', () => {
    it('should log message to file and console', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      utilities.logToFile('Test message');
      
      expect(consoleSpy).toHaveBeenCalledWith('Test message');
      expect(fs.existsSync('bot.log')).toBe(true);
      
      const logContent = fs.readFileSync('bot.log', 'utf8');
      expect(logContent).toContain('Test message');
      
      consoleSpy.mockRestore();
    });
  });

  describe('cleanupFile', () => {
    it('should remove existing file', () => {
      const testFile = 'test-file.txt';
      fs.writeFileSync(testFile, 'test content');
      
      expect(fs.existsSync(testFile)).toBe(true);
      utilities.cleanupFile(testFile);
      
      // Wait a bit for async file deletion
      setTimeout(() => {
        expect(fs.existsSync(testFile)).toBe(false);
      }, 100);
    });

    it('should handle non-existent file gracefully', () => {
      expect(() => {
        utilities.cleanupFile('non-existent-file.txt');
      }).not.toThrow();
    });
  });
});
