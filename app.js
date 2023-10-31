const child_process = require('child_process');
const { exec } = require('child_process');

const fs = require('fs');
const https = require('https');
const path = require('path');
const log = require("./utils/log");
const ApiHelper = require("./utils/api_helper");
const ConfigHelper = require("./utils/config_helper");
const Settings = require("./enums/settings");
const {runCommand} = require("./ExeHelper");

const downloadAndCheckExe = async (data) => {
    try {
        await stopService(data.service_name)

        await downloadFile(data);

    } catch (e) {
        log.error("downloadAndCheckExe error: " + e);
    }
};
const downloadFile = (data) => {
    const {service_name, file_url, exe_full_path} = data;

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(exe_full_path);

        https.get(file_url, (response) => {
            response.pipe(file);
            response.on('end', async () => {
                file.close();

                const config = await ConfigHelper.readConfigAsJson();
                config.services = config.services.map((service) => {
                    if (service.service_name === service_name) {
                        service.version_number = data.version_number;
                    }
                    return service;
                });
                await ConfigHelper.writeConfig(config);

                resolve();
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};
const stopService = async (serviceName) => {
    const commandOptions = {
        command: `C:\\Users\\impROS\\IdeaProjects\\nodejs-service-updater\\build\\nssm.exe`,
        args: ['stop', serviceName],
        options: {cwd: '/'},
    };

    try {
        const output = await runCommand(commandOptions);
        console.log('Komut çıktısı:', output);
    } catch (error) {
        console.error('Hata:', error);
    }
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

