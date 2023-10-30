const fs = require("fs").promises;
const Constants = require("./constants");
const log = require("../utils/log");

const readConfigAsJson = async (filePath = Constants.CONFIG_PATH) => {
    try {
        if (!await fileExists(filePath)) {
            await createConfigFile(filePath);
        }
        const rawData = await fs.readFile(filePath, "utf8");
        log.info(`readConfigAsJson Success: ${filePath}`);
        return JSON.parse(rawData);
    } catch (e) {
        log.error(`readConfigAsJson Error: ${e}`);
        throw e;
    }
};

const createConfigFile = async (filePath = Constants.CONFIG_PATH) => {
    const config = {
        windows_service_version_number: 0,
        windows_service_update_required: false,
        windows_service_update_required_message: "",
        windows_service_update_url: "",
        created_at: new Date(),
        updated_at: new Date(),
    };

    try {
        await fs.writeFile(filePath, JSON.stringify(config, null, 4), "utf8");
        log.info(`createConfigFile Success: ${filePath}`);
    } catch (e) {
        log.error(`createConfigFile Error: ${e}`);
        throw e;
    }
};

const readOrCreateConfig = async (filePath = Constants.CONFIG_PATH) => {
    if (!await fileExists(filePath)) {
        await createConfigFile(filePath);
    }
    return await readConfigAsJson(filePath);
};

const writeConfig = async (config, filePath = Constants.CONFIG_PATH) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(config, null, 4), "utf8");
    } catch (e) {
        log.error(`writeConfig Error: ${e}`);
        throw e;
    }
};

const readConfigValue = async (key, defaultValue, filePath = Constants.CONFIG_PATH) => {
    try {
        if (!await fileExists(filePath)) {
            await createConfigFile(filePath);
        }
        const config = await readConfigAsJson(filePath);
        return config[key] !== undefined ? config[key] : defaultValue;
    } catch (e) {
        log.error(`readConfigValue Error: ${e}`);
        return defaultValue;
    }
};

const fileExists = async filePath => {
    try {
        await fs.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
};

module.exports = {
    readConfigAsJson,
    readOrCreateConfig,
    writeConfig,
    readConfigValue,
};
