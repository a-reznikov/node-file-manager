import { resolve } from 'path';
import { readdir } from 'node:fs/promises';
import readline from 'node:readline';
import os from 'os';
import { setUserName } from './services/cli.js'
import { readFile } from './services/read.js';
import { createFile } from './services/add.js';
import { renameFile } from './services/rename.js';
import { copyFileToDestination } from './services/copy.js';
import { deleteFile } from './services/delete.js';
import { getOsInfo } from './services/os.js';

export default class FileManager {
  constructor() {
    this.userName = setUserName();
    this.rootDir = os.homedir();
    this.currentPath = this.rootDir
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `Enter command >: `,
    });
  }

  setPath(path) {
    return resolve(this.currentPath, path);
  }

  async isValidInput(line, command) {
    const availableCommands = ['up', 'cd', 'ls', 'cat', 'add', 'rn', 'cp', 'mv', 'rm', 'os', 'hash', 'compress', 'decompress'];
    return line === line.split(' ').filter((elem) => elem).join(' ') && availableCommands.includes(command);
  }

  up() {
    if (this.currentPath !== this.rootDir) {
      this.currentPath = this.setPath('..');
    }
  }

  cd([path]) {
    this.currentPath = this.setPath(path);
  }

  async cat([path]) {
    const pathToFile = this.setPath(path);
    await readFile(pathToFile);
  }

  async add([path]) {
    const pathToFile = this.setPath(path);
    await createFile(pathToFile);
  }

  async rn([source, destination]) {
    const sourcePath = this.setPath(source);
    const destinationPath = this.setPath(destination);
    await renameFile(sourcePath, destinationPath);
  }

  async cp([source, destination]) {
    const sourcePath = this.setPath(source);
    const destinationPath = this.setPath(destination);
    await copyFileToDestination(source, sourcePath, destinationPath);
  }

  async rm([path]) {
    const pathToFile = this.setPath(path);
    await deleteFile(pathToFile);
  }

  async mv(path) {
    await this.cp(path);
    await this.rm(path);
    this.message('move')
  }

  async os([key]) {
    await getOsInfo(key);
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
      case 'path':
        console.log(`You are currently in ${this.currentPath}`);
        break;
      case 'move':
        console.log(`=== File was successfully moved! ===`);
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

  async start() {
    this.message('greeting');
    this.message('path');
    this.rl.prompt();

    this.rl.on('line', async (line) => {
      const [command, ...args] = line.split(' ');

      if (await this.isValidInput(line, command)) {

        if (command === '.exit') {
          this.message('exit');
          process.exit(0);
        }

        try {
          await this[command](args);
        } catch {
          this.message('failed');
        }
      } else {
        this.message('invalid');
      }

      this.message('path');
      this.rl.prompt();
    }).on('close', () => {
      this.message('exit');
      process.exit(0);
    });
  }
}