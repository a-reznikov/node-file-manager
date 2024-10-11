import { EOL } from 'node:os';
import { cpus, homedir, userInfo, arch } from 'os';

const processes = cpus();

export const getOsInfo = async (key) => {
    switch (key) {
        case '--EOL':
            console.log(`EOL: ${JSON.stringify(EOL)}`);
            break;
        case '--cpus':
            console.log(`CPUS INFO:`);
            console.table(
                processes.map((process) => ({
                    Model: process.model,
                    Clock_Rate: `${process.speed / 1000} GHz`,
                }))
            );
            break;
        case '--homedir':
            console.log(`Homedir: ${homedir()}`);
            break;
        case '--username':
            console.log(`Username: ${userInfo().username}`);
            break;
        case '--architecture':
            console.log(`Architecture: ${arch()}`);
            break;
        default:
            console.log(`Invalid input`);
            break;
    }
}
