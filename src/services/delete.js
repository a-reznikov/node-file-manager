import { rm } from 'node:fs/promises';

export const deleteFile = async (pathToFile) => {
    try {
        await rm(pathToFile, { recursive: true });
        console.log('=== File was successfully deleted! ===');
    } catch (error) {
        throw error;
    }
};