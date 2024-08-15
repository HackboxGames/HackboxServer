import logger from '@logger';

import isDocker from 'is-docker';
import path from 'path';
import os from 'os';
import fs from 'fs';

type ENVIRONMENT = {
    HACKBOX_SERVER_ENV: string;
    HACKBOX_SERVER_TYPE: string;
    HACKBOX_SERVER_OS: NodeJS.Platform,
    HACKBOX_ROOT_DIR: string;
    HACKBOX_SRC_DIR: string;
    HACKBOX_CONTENT_DIR: string;
    HACKBOX_DATA_DIR: string;
    HACKBOX_CONFIG_DIR: string;
    HACKBOX_CONFIG_PATH: string;
    HACKBOX_DEFAULT_CONFIG_PATH: string;
    HACKBOX_PLUGIN_DIR: string;
    HACKBOX_LOG_DIR: string;
    HACKBOX_DATABASE_DIR: string;
    HACKBOX_DATABASE_TYPE: "sqlite"
    HACKBOX_DATABASE_PATH: string;
    HACKBOX_DATABASE_SCHEMA: string;
    HACKBOX_PRISMA_URL: string;
};

const environment: ENVIRONMENT = {
    HACKBOX_SERVER_ENV: "",
    HACKBOX_SERVER_TYPE: "",
    HACKBOX_SERVER_OS: os.platform(),
    HACKBOX_ROOT_DIR: "",
    HACKBOX_SRC_DIR: "",
    HACKBOX_CONTENT_DIR: "",
    HACKBOX_DATA_DIR: "",
    HACKBOX_CONFIG_DIR: "",
    HACKBOX_CONFIG_PATH: "",
    HACKBOX_DEFAULT_CONFIG_PATH: "",
    HACKBOX_PLUGIN_DIR: "",
    HACKBOX_LOG_DIR: "",
    HACKBOX_DATABASE_DIR: "",
    HACKBOX_DATABASE_TYPE: "sqlite",
    HACKBOX_DATABASE_PATH: "",
    HACKBOX_DATABASE_SCHEMA: "",
    HACKBOX_PRISMA_URL: "",
};

export function setupEnvironment(): void {
    logger.info("Setting up environment...");

    // Set up the server environment
    if (process.env.HACKBOX_SERVER_ENV == "development" || process.env.HACKBOX_SERVER_ENV == "production") {
        environment.HACKBOX_SERVER_ENV = process.env.HACKBOX_SERVER_ENV;
    } else {
        logger.error("No environment detected?!?! This should never happen, yet here we are...");
        logger.error("Please report this to the developers immediately!");
        logger.error("If you are a developer, please ensure you have not overwritten the HACKBOX_SERVER_ENV environment variable!");
        logger.error("Shutting down...");
        process.exit(1);
    }

    // Set up the server type
    if (isDocker()) {
        environment.HACKBOX_SERVER_TYPE = "docker";
    } else {
        environment.HACKBOX_SERVER_TYPE = "standalone";
    }

    // Set up the root directory
    environment.HACKBOX_ROOT_DIR = path.resolve(path.join(__dirname, "..", ".."));

    // Set up the src directory
    environment.HACKBOX_SRC_DIR = path.resolve(path.join(__dirname, ".."));

    // Set up the content directory
    if (process.env.HACKBOX_CONTENT_DIR) {
        environment.HACKBOX_CONTENT_DIR = path.resolve(process.env.HACKBOX_CONTENT_DIR);
    } else {
        if (environment.HACKBOX_SERVER_TYPE == "docker") {
            environment.HACKBOX_CONTENT_DIR = path.resolve(path.join(__dirname, "..", "..", "..", "content"));
        } else {
            logger.error("No content directory detected! This is required for HackboxServer to run!");
            logger.error("Shutting down...");
            process.exit(1);
        }
    }

    // Set up the data directory
    if (process.env.HACKBOX_DATA_DIR) {
        environment.HACKBOX_DATA_DIR = path.resolve(process.env.HACKBOX_DATA_DIR);
    } else {
        if (environment.HACKBOX_SERVER_TYPE == "docker") {
            environment.HACKBOX_DATA_DIR = path.resolve(path.join(__dirname, "..", "..", "..", "data"));
        } else {
            if (environment.HACKBOX_SERVER_OS == "win32") {
                if (!process.env.LOCALAPPDATA) {
                    logger.error("LOCALAPPDATA environment variable not set! This is required for HackboxServer to run!");
                    logger.error("Shutting down...");
                    process.exit(1);
                }
                environment.HACKBOX_DATA_DIR = path.resolve(path.join(process.env.LOCALAPPDATA, "HackboxServer"));
            }
        }
    }

    // Create the data directory if it doesn't exist
    if (!fs.existsSync(environment.HACKBOX_DATA_DIR)) {
        try {
            fs.mkdirSync(environment.HACKBOX_DATA_DIR);
        } catch (error) {
            logger.error("Data directory could not be created! This is required for HackboxServer to run!");
            logger.error("Shutting down...");
            process.exit(1);
        }
    }

    // Check if the data directory is writable
    try {
        fs.accessSync(environment.HACKBOX_DATA_DIR, fs.constants.W_OK);
    } catch (error) {
        logger.error("Data directory is not writable! This is required for HackboxServer to run!");
        logger.error("Shutting down...");
        process.exit(1);
    }

    // Set up the config directory
    environment.HACKBOX_CONFIG_DIR = path.resolve(path.join(environment.HACKBOX_DATA_DIR, "configs"));

    // Create the config directory if it doesn't exist
    if (!fs.existsSync(environment.HACKBOX_CONFIG_DIR)) {
        try {
            fs.mkdirSync(environment.HACKBOX_CONFIG_DIR);
        } catch (error) {
            logger.error("Config directory could not be created! This is required for HackboxServer to run!");
            logger.error("Shutting down...");
            process.exit(1);
        }
    }

    // Check if the config directory is writable
    try {
        fs.accessSync(environment.HACKBOX_CONFIG_DIR, fs.constants.W_OK);
    } catch (error) {
        logger.error("Config directory is not writable! This is required for HackboxServer to run!");
        logger.error("Shutting down...");
        process.exit(1);
    }

    // Set up the config path
    environment.HACKBOX_CONFIG_PATH = path.resolve(path.join(environment.HACKBOX_CONFIG_DIR, "hackbox.json"));

    // Set up the default config path
    environment.HACKBOX_DEFAULT_CONFIG_PATH = path.resolve(path.join(environment.HACKBOX_SRC_DIR, "managers", "ConfigManager", "default.json"));

    // Set up the plugin directory
    environment.HACKBOX_PLUGIN_DIR = path.resolve(path.join(environment.HACKBOX_DATA_DIR, "plugins"));

    // Create the plugin directory if it doesn't exist
    if (!fs.existsSync(environment.HACKBOX_PLUGIN_DIR)) {
        try {
            fs.mkdirSync(environment.HACKBOX_PLUGIN_DIR);
        } catch (error) {
            logger.error("Plugin directory could not be created! This is required for HackboxServer to run!");
            logger.error("Shutting down...");
            process.exit(1);
        }
    }

    // Check if the plugin directory is writable
    try {
        fs.accessSync(environment.HACKBOX_PLUGIN_DIR, fs.constants.W_OK);
    } catch (error) {
        logger.error("Plugin directory is not writable! This is required for HackboxServer to run!");
        logger.error("Shutting down...");
        process.exit(1);
    }

    // Set up the log directory
    environment.HACKBOX_LOG_DIR = path.resolve(path.join(environment.HACKBOX_DATA_DIR, "logs"));

    // Create the log directory if it doesn't exist
    if (!fs.existsSync(environment.HACKBOX_LOG_DIR)) {
        try {
            fs.mkdirSync(environment.HACKBOX_LOG_DIR);
        } catch (error) {
            logger.error("Log directory could not be created! This is required for HackboxServer to run!");
            logger.error("Shutting down...");
            process.exit(1);
        }
    }

    // Check if the log directory is writable
    try {
        fs.accessSync(environment.HACKBOX_LOG_DIR, fs.constants.W_OK);
    } catch (error) {
        logger.error("Log directory is not writable! This is required for HackboxServer to run!");
        logger.error("Shutting down...");
        process.exit(1);
    }

    // Set up the database directory
    environment.HACKBOX_DATABASE_DIR = path.resolve(path.join(environment.HACKBOX_DATA_DIR, "databases"));

    // Create the database directory if it doesn't exist
    if (!fs.existsSync(environment.HACKBOX_DATABASE_DIR)) {
        try {
            fs.mkdirSync(environment.HACKBOX_DATABASE_DIR);
        } catch (error) {
            logger.error("Database directory could not be created! This is required for HackboxServer to run!");
            logger.error("Shutting down...");
            process.exit(1);
        }
    }

    // Check if the database directory is writable
    try {
        fs.accessSync(environment.HACKBOX_DATABASE_DIR, fs.constants.W_OK);
    } catch (error) {
        logger.error("Database directory is not writable! This is required for HackboxServer to run!");
        logger.error("Shutting down...");
        process.exit(1);
    }

    // Set up the database path
    if (environment.HACKBOX_DATABASE_TYPE == "sqlite") {
        environment.HACKBOX_DATABASE_PATH = path.resolve(path.join(environment.HACKBOX_DATABASE_DIR, "hackbox.sqlite"));
    } else {
        logger.error("Database type not supported yet! Shutting down...");
        process.exit(1);
    }

    // Set up the database schema
    if (environment.HACKBOX_DATABASE_TYPE == "sqlite") {
        environment.HACKBOX_DATABASE_SCHEMA = path.resolve(path.join(environment.HACKBOX_SRC_DIR, "managers", "DatabaseManager", "SQLiteManager", "schema.prisma"));
    } else {
        logger.error("Database type not supported yet! Shutting down...");
        process.exit(1);
    }

    // Set up the Prisma URL
    if (environment.HACKBOX_DATABASE_TYPE == "sqlite") {
        environment.HACKBOX_PRISMA_URL = `file:${environment.HACKBOX_DATABASE_PATH}`;
    } else {
        logger.error("Database type not supported yet! Shutting down...");
        process.exit(1);
    }

    // set the process environment variables
    for (const key in environment) {
        process.env[key] = environment[key as keyof ENVIRONMENT];
    }

    //console.log(environment);
    //console.log(process.env);

    logger.info("Environment setup complete!");
}

export default environment;