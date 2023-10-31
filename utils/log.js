const chalk = require("chalk");
const fs = require("fs");
const LogType = require("../enums/log_type");

const info = (...messages) => writeLog(LogType.INFO, ...messages);
const debug = (...messages) => writeLog(LogType.DEBUG, ...messages);
const error = (...messages) => writeLog(LogType.ERROR, ...messages);
const warning = (...messages) => writeLog(LogType.WARNING, ...messages);
const success = (...messages) => writeLog(LogType.SUCCESS, ...messages);

const writeLog = (type, ...messages) => {
    const colorMap = {
        [LogType.SUCCESS]: "green",
        [LogType.ERROR]: "red",
        [LogType.DEBUG]: "yellow",
        [LogType.INFO]: "blue",
    };

    const logColor = colorMap[type] || "black";
    const logMessage = JSON.stringify(messages);

    console.log(chalk[logColor](logMessage));
    writeFileLog(type, messages);
};

const writeFileLog = (logFile, messages) => {
    try {
        const date = new Date();
        const log = `${date.toLocaleDateString()} : ${date.toLocaleTimeString()} => ${JSON.stringify(messages)}`;

        if (!fs.existsSync('logs')) {
            fs.mkdirSync('logs');
        }

        fs.appendFileSync(`logs/${logFile}`, log + '\n\n', {encoding: 'utf-8'});
    } catch (e) {
        console.log("writeFileLog error : " + e);
    }
}

module.exports = {
    info,
    debug,
    error,
    warning,
    success
}

