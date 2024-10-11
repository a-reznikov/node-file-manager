import { join } from 'path';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { stat, rm } from 'node:fs/promises';


export const moveFileToDestination = async (fileName, source, destination) => {
    try {
        await stat(destination);
        const streamRead = createReadStream(source, 'utf-8');
        const streamWrite = createWriteStream(join(destination, fileName), 'utf-8');
        await pipeline(streamRead, streamWrite);

        await rm(source, { recursive: true });

        console.log('=== File was successfully moved! ===');
    } catch (error) {
        throw new error;
    }
};