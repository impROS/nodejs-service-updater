const util = require('util');
const exec = util.promisify(require('child_process').exec);

const runCommand = async ({ command, args = [], options = {} }) => {
    try {
        const fullCommand = [command, ...args].join(' ');
        const { stdout, stderr } = await exec(fullCommand, options);
        return stdout;
    } catch (error) {
        console.error(`Komut çalıştırma hatası: ${error}`);
        throw error;
    }
};

module.exports = {
    runCommand
};