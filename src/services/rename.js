import fs, { stat } from 'node:fs/promises';

export const renameFile = async (source, destination) => {
    try {
        await stat(destination);
        throw new Error("There is a file with this name");
    } catch {
        try {
            await fs.rename(source, destination);
            console.log('=== File was successfully renamed! ===');
        } catch (error) {
            throw error;
        }
    }
};