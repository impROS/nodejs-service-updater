const runService = async () => {
    const currentTime = new Date().toLocaleTimeString();
    writeFileLog('Servis çalıştı: ' + currentTime);
};

const writeFileLog = (logFile, messages) => {
    try {
        const logFile = 'test.txt';
        const date = new Date();
        const log = `${date.toLocaleDateString()} : ${date.toLocaleTimeString()} => ${JSON.stringify(messages)}`;

        if (!fs.existsSync('logs')) {
            fs.mkdirSync('logs');
        }

        fs.appendFileSync(`${logFile}`, log + '\n\n', {encoding: 'utf-8'});
    } catch (e) {
        console.log("writeFileLog error : " + e);
    }
}

const fs = require("fs");

async function runInterval() {
    const serviceInterval = 10000;

    const currentTime = new Date().toLocaleTimeString();
    runService()
        .then(() => {
            writeFileLog('Servis çalıştı: ' + currentTime);
            setTimeout(runInterval, Number(serviceInterval));
        })
        .catch(async (error) => {
            writeFileLog('Hata oluştu runInterval : ' + error.message);
            setTimeout(runInterval, Number(serviceInterval));
        });

}

runInterval();