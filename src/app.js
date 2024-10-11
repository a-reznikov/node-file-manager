import { resolve } from 'path';
import { readdir } from 'node:fs/promises';
import readline from 'node:readline';
import os from 'os';
import { stat } from 'node:fs/promises';
import { setUserName } from './services/cli.js'
import { readFile } from './services/read.js';
import { createFile } from './services/add.js';
import { renameFile } from './services/rename.js';
import { copyFileToDestination } from './services/copy.js';
import { deleteFile } from './services/delete.js';
import { getOsInfo } from './services/os.js';
import { calculateHash } from './services/hash.js';
import { compressFile, decompressFile } from './services/zip.js';
import { moveFileToDestination } from './services/move.js';

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

  async cd([path]) {
    const destination = this.setPath(path);

    if (!destination.startsWith(this.rootDir)) {
      this.currentPath = this.rootDir;

      return;
    }

    try {
      await stat(destination);
      this.currentPath = this.setPath(path);
    } catch (error) {
      throw new error;
    }
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

  async mv([source, destination]) {
    const sourcePath = this.setPath(source);
    const destinationPath = this.setPath(destination);
    await moveFileToDestination(source, sourcePath, destinationPath);
  }

  async os([key]) {
    await getOsInfo(key);
  }

  async hash([path]) {
    const pathToFile = this.setPath(path);
    await calculateHash(pathToFile);
  }

  async compress([source, destination]) {
    const sourcePath = this.setPath(source);
    const destinationPath = this.setPath(destination);
    await compressFile(source, sourcePath, destinationPath);
  }

  async decompress([source, destination]) {
    const sourcePath = this.setPath(source);
    const destinationPath = this.setPath(destination);
    await decompressFile(source, sourcePath, destinationPath);
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
        console.log(`\nYou are currently in ${this.currentPath}`);
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
      if (command === '.exit') {
        this.message('exit');
        process.exit(0);
      }

      if (await this.isValidInput(line, command)) {

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