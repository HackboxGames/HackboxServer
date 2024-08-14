import "dotenv/config";
import "./util/alias";

import logger, { setLoggerFileTransport } from "@logger";
import environment, { setupEnvironment } from "@environment";

import Manager from "@hackbox/manager";
import { DatabaseManager, WebServerManager } from "@hackbox/managers";

export default class HackboxServer {

    private managers: Manager[];
    private databaseManager: DatabaseManager;
    private webServerManager: WebServerManager;

    constructor() {
        this.databaseManager = new DatabaseManager(this);
        this.webServerManager = new WebServerManager(this);

        this.managers = [
            this.databaseManager,
            this.webServerManager
        ];

        this.start();
    }

    public async start(): Promise<void> {
        logger.info("Welcome to HackboxServer! Getting things ready...");

        setupEnvironment();
        setLoggerFileTransport();

        logger.verbose("HackboxServer environment setup complete.")
        logger.verbose("Setting up managers...");

        await this.setupAllManagers();
        await this.startAllManagers();
        
        process.on("SIGINT", this.stop.bind(this));

        logger.info("HackboxServer is ready! Enjoy!");
    }

    public async stop(): Promise<void> {
        logger.verbose("Stopping...");
        await this.stopAllManagers();
        logger.verbose("Stopped!");
        process.exit(0);
    }

    public async setupAllManagers(): Promise<void> {
        const promises = [];
        for (const manager of this.managers) {
            promises.push(manager.onSetup());
        }
        await Promise.all(promises);
    }

    public async startAllManagers(): Promise<void> {
        const promises = [];
        for (const manager of this.managers) {
            promises.push(manager.onStart());
        }
        await Promise.all(promises);
    }

    public async stopAllManagers(): Promise<void> {
        const promises = [];
        for (const manager of this.managers) {
            promises.push(manager.onStop());
        }
        await Promise.all(promises);
    }

    public getDatabaseManager(): DatabaseManager {
        return this.databaseManager;
    }

    public getWebServerManager(): WebServerManager {
        return this.webServerManager;
    }

}

new HackboxServer();