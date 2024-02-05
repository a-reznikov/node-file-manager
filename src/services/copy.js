import { copyFile } from 'node:fs/promises';
import { join } from 'path';

export const copyFileToDestination = async (fileName, source, destination) => {
    try {
        await copyFile(source, join(destination, fileName));
        console.log('=== File was successfully copied! ===');
    } catch (error) {
        throw new error;
    }
};