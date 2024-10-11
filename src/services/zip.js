import { join } from 'path';
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { stat } from 'node:fs/promises';

export const compressFile = async (fileName, pathToFile, pathToArchive) => {
    try {
        await stat(pathToArchive);
        await pipeline(
            createReadStream(pathToFile),
            createBrotliCompress(),
            createWriteStream(join(pathToArchive, `${fileName}.br`)),
        );
        console.log('Successfully compressed!');
    } catch (error) {
        throw new error;
    }
};

export const decompressFile = async (fileName, pathToArchive, pathToFolder) => {
    try {
        await stat(pathToFolder);
        await pipeline(
            createReadStream(pathToArchive),
            createBrotliDecompress(),
            createWriteStream(join(pathToFolder, `${fileName.slice(0, -3)}`)),
        );
        console.log('Successfully decompressed!');
    } catch (error) {
        throw new error;
    }
};