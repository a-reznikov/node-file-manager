import readline from 'node:readline';
import { setUserName } from './services/cli.js'

export default class FileManager {
  constructor() {
    this.userName = setUserName();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'ENTER COMMAND >',
    });
  }

  message(action) {
    switch (action) {
      case 'greeting':
        console.log(`Welcome to the File Manager, ${this.userName}!`);
        break;
      case 'exit':
        console.log(`\nThank you for using File Manager, ${this.userName}, goodbye!\n`);
        break;
    }
  }

  start() {
    this.message('greeting');
    this.rl.prompt();

    this.rl.on('line', (line) => {
      switch (line.trim()) {
        case '.exit':
          this.message('exit');
          process.exit(0);
        default:
          console.log(`Unknown command.`);
          break;
      }
      this.rl.prompt();
    }).on('close', () => {
      this.message('exit');
      process.exit(0);
    });
  }
}