#!/usr/bin/env node

const { Command } = require('commander');
const InstagramMemeBot = require('../src/index');
const packageJson = require('../package.json');

const program = new Command();
const bot = new InstagramMemeBot();

program
  .name('instagram-meme-bot')
  .description('Automated Instagram meme posting bot')
  .version(packageJson.version);

program
  .command('run')
  .description('Run the bot continuously (posts memes at random intervals)')
  .option('--once', 'Run only once instead of continuously')
  .action(async (options) => {
    try {
      console.log('🤖 Instagram Meme Bot starting...\n');
      
      if (options.once) {
        console.log('Running single cycle...');
        await bot.runOnce();
        console.log('✅ Single cycle completed!');
      } else {
        console.log('Running continuously... (Press Ctrl+C to stop)');
        await bot.run();
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Setup Instagram credentials and configuration interactively')
  .action(async () => {
    try {
      await bot.setupConfig();
    } catch (error) {
      console.error('❌ Configuration error:', error.message);
      process.exit(1);
    }
  });

program
  .command('version')
  .description('Display version information')
  .action(() => {
    console.log(`Instagram Meme Bot v${packageJson.version}`);
    console.log('A production-ready npm package for automated Instagram meme posting');
  });

// Handle unknown commands
program.on('command:*', () => {
  console.error('❌ Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
