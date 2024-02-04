import { readdir } from 'node:fs/promises';
import readline from 'node:readline';
import os from 'os';
import { setUserName } from './services/cli.js'

export default class FileManager {
  constructor() {
    this.userName = setUserName();
    this.currentPath = os.homedir();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `You are currently in ${this.currentPath} >: `,
    });
  }

  isValidInput(line, command) {
    const availableCommands = ['up', 'cd', 'ls', 'cat', 'add', 'rn', 'cp', 'mv', 'rm', 'os', 'hash', 'compress', 'decompress'];
    return line === line.split(' ').filter((elem) => elem).join(' ') && availableCommands.includes(command);
  }

  async ls() {
    const listObject = await readdir(this.currentPath, { withFileTypes: true });
    const directories = listObject.filter((object) => !object.isFile()).sort((a, b) => a.name.localeCompare(b.name));
    const files = listObject.filter((object) => object.isFile()).sort((a, b) => a.name.localeCompare(b.name));
    const objects = [...directories, ...files];

    console.table(
      objects.map((object) => ({
        Name: object.name,
        Type: object.isFile() ? 'file' : 'directory',
      }))
    );
  }

  message(action) {
    switch (action) {
      case 'greeting':
        console.log(`Welcome to the File Manager, ${this.userName}!`);
        break;
      case 'exit':
        console.log(`\nThank you for using File Manager, ${this.userName}, goodbye!\n`);
        break;
      case 'invalid':
        console.log(`Invalid input`);
        break;
      case 'failed':
        console.log(`Operation failed!`);
        break;
    }
  }

  start() {
    this.message('greeting');
    this.rl.prompt();

    this.rl.on('line', (line) => {
      const [command, ...args] = line.split(' ');

      if (this.isValidInput(line, command)) {

        if (command === '.exit') {
          this.message('exit');
          process.exit(0);
        }

        try {
          this[command](args);
        } catch {
          this.message('failed');
        }
      } else {
        this.message('invalid');
      }

      this.rl.prompt();
    }).on('close', () => {
      this.message('exit');
      process.exit(0);
    });
  }
}