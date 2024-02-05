import { createReadStream } from 'fs';

export const readFile = async (path) => {
    try {
        const readableStream = createReadStream(path, 'utf-8');

        readableStream.pipe(process.stdout);

        return await new Promise((resolve, reject) => {
            readableStream.on('end', () => resolve());
            readableStream.on('error', () => reject());
        });
    } catch (error) {
        throw new error;
    }
}
