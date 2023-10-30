const child_process = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');
const log = require("./utils/log");
const ApiHelper = require("./utils/api_helper");
const ConfigHelper = require("./utils/config_helper");
const Settings = require("./enums/settings");

const downloadAndCheckExe = async (data) => {
    try {
        const {service_name, file_url, exe_full_path} = data;
        const file = fs.createWriteStream(exe_full_path);
        await https.get(file_url, (response) => {
            response.pipe(file);
            response.on('end', async () => {
                file.close(stopService(service_name));

                const config = await ConfigHelper.readConfigAsJson();
                config.services = config.services.map((service) => {
                    if (service.service_name === service_name) {
                        service.version_number = data.version_number;
                    }
                    return service;
                });
                await ConfigHelper.writeConfig(config);
            });
        });

    } catch (e) {
        log.error("downloadAndCheckExe error: " + e);
    }
};

const stopService = (serviceName) => {
    const stopServiceCommand = `net stop ${serviceName}`;
    child_process.exec(stopServiceCommand, (error, stdout) => {
        if (error) {
            log.error(`Servis durdurulurken hata oluştu: ${error.message}`);
        } else {
            log.info(`Servis durduruldu: ${stdout}`);
        }
    });
};

const checkUpdate = async () => {
    try {
        const services = await ConfigHelper.readConfigValue(Settings.services, []);

        for (const service of services) {
            try {
                let remoteSettings = await ApiHelper.getSettings(service.setting_url);
                remoteSettings = remoteSettings.data;
                console.log(remoteSettings);

                if (remoteSettings.version_number > service.version_number && remoteSettings.is_update_required) {
                    await downloadAndCheckExe(remoteSettings);
                }
            } catch (e) {
                log.error("checkUpdate error: " + e);
            }
        }

    } catch (e) {
        log.error("checkUpdate error: " + e);
    }
};

module.exports = {
    checkUpdate
};

