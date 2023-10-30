const child_process = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');
const log = require("./utils/log");
const exePath = path.join(__dirname, 'your-app.exe');
const ApiHelper = require("./utils/api_helper");
const ConfigHelper = require("./utils/config_helper");
const Settings = require("./enums/settings");

const downloadAndCheckExe = data => {
    try {
        const file = fs.createWriteStream(exePath);
        https.get(data.windows_service_update_url, (response) => {
            response.pipe(file);
            response.on('end', () => {
                file.close(stopService);
            });
        });
    } catch (e) {
        log.error("downloadAndCheckExe error: " + e);
    }
};

const stopService = () => {
    const stopServiceCommand = 'net stop SERVICE_NAME';
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
        const result = await ApiHelper.getSettings();
        const config = ConfigHelper.readConfigAsJson();
        const versionNumber = ConfigHelper.readConfigValue(Settings.windows_service_version_number, 0);

        if (result.data.windows_service_version_number > versionNumber && result.data.windows_service_update_required) {
            downloadAndCheckExe(result.data);
        }

        console.log(result.data);
    } catch (e) {
        log.error("checkUpdate error: " + e);
    }
};

checkUpdate();
