import { join } from 'path';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

export const copyFileToDestination = async (fileName, source, destination) => {
    try {
        const streamRead = createReadStream(source, 'utf-8');
        const streamWrite = createWriteStream(join(destination, fileName), 'utf-8');
        await pipeline(streamRead, streamWrite);
        console.log('=== File was successfully copied! ===');
    } catch (error) {
        throw new error;
    }
};