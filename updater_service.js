const ConfigPath = require("./utils/config_helper");
const {checkUpdate} =require("./app");
const fs = require("fs");
const log = require("./utils/log");
const runService = async () => {
    log.info('Servis çalıştı: ');
    checkUpdate()
}; //end of runService

module.exports = runService;
