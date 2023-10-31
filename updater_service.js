const {checkUpdate} =require("./app");
const log = require("./utils/log");
const runService = async () => {
    log.info('Servis çalıştı: ');
    await checkUpdate()
};

module.exports = runService;
