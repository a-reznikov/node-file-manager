import { appendFile } from 'node:fs/promises';

export const createFile = async (pathToFile) => {
    console.log(pathToFile);
    try {
        await appendFile(pathToFile, '', { flag: 'wx' });
        console.log('=== File was successfully created! ===');
    } catch (error) {
        throw error;
    }
};