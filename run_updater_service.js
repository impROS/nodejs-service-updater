const updaterService = require('./updater_service');
const log = require("./utils/log");
const SETTINGS = require("./enums/settings");
// const RemoteLog = require("./utils/remote_log");
const ConfigHelper = require("./utils/config_helper");

async function runInterval() {
    const serviceStatus = await ConfigHelper.readConfigValue(SETTINGS.service_status, true);
    const serviceInterval = await ConfigHelper.readConfigValue(SETTINGS.service_interval, 60000);
    // await RemoteLog.add({
    //     type: 'INFO',
    //     title: 'Servis çalıştı ' + new Date().toLocaleTimeString(),
    //     description: `Servis durumu: ${serviceStatus} Servis aralığı: ${serviceInterval}`,
    //     json_data: {
    //         serviceStatus: serviceStatus,
    //         serviceInterval: serviceInterval
    //     }
    // });//end RemoteLog
    if (serviceStatus) {
        const currentTime = new Date().toLocaleTimeString();
        updaterService()
            .then(() => {
                log.info('Servis çalıştı: ' + currentTime);
                setTimeout(runInterval, Number(serviceInterval));
            })
            .catch(async (error) => {
                log.error('Hata oluştu runInterval : ', error);
                // await RemoteLog.add({
                //     type: 'ERROR',
                //     title: 'Servis çalışırken hata oluştu',
                //     description: `${error}`,
                // })
                setTimeout(runInterval, Number(serviceInterval));
            });
    } else {
        log.info('Servis duraklatıldı');
        setTimeout(runInterval, Number(serviceInterval));
    }
}

runInterval();