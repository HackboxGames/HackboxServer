import environment from "@environment";
import Manager from "@hackbox/manager"

import fastify, { FastifyInstance } from "fastify";
import next from 'next';
import { NextServer, RequestHandler } from 'next/dist/server/next';
import proxy from "@fastify/http-proxy";

export default class WebServerManager extends Manager {

    private server!: FastifyInstance;
    private nextApp!: NextServer;
    private nextHandler!: RequestHandler;

    public initialize(): void {
        this.server = fastify();
    }

    public async setup(): Promise<void> {
        this.nextApp = next({
            dev: environment.HACKBOX_SERVER_ENV == "development",
            dir: environment.HACKBOX_ROOT_DIR
        });
        this.nextHandler = this.nextApp.getRequestHandler();
        await this.nextApp.prepare();
        this.server.addHook("preHandler", async (req, res) => {
            if ((req.headers.referer?.includes("/proxy/jackbox") || req.headers["sec-fetch-dest"] == "iframe") && req.url !== "/proxy/jackbox") {
                return res.redirect("https://jackbox.tv" + req.url, 301);
            }
        });
        this.server.register(proxy, {
            upstream: 'https://jackbox.tv',
            prefix: '/proxy/jackbox'
        });
        this.server.all("*", (req, res) => {
            this.nextHandler(req.raw, res.raw);
        });
    }

    public async start(): Promise<void> {
        await this.server.listen({
            port: 2014,
            host: "0.0.0.0"
        });
    }

    public async stop(): Promise<void> {
        
    }

}