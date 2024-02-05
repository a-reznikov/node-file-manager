import { pipeline } from 'node:stream/promises';
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto'

export const calculateHash = async (pathToFile) => {
  try {
    const stream = createReadStream(pathToFile);
    const hash = createHash('sha256');
    await pipeline(stream, hash);
    console.log('HASH: ', hash.digest('hex'));
  } catch (error) {
    throw error;
  }
};