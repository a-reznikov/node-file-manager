export const setUserName = () => {
    const filteredUserName = process.argv.filter((arg) => arg.startsWith('--username='));
    const parsedUserName = filteredUserName.length ? filteredUserName[0].split('=')[1] : 'Guest';

    return parsedUserName || 'Guest';
};