import type { ServiceConfig } from "@/types/index.js";
import { env } from "./env.js";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { logger } from "./logger.js";
import { ERROR_CODE, ERROR_TYPE } from "@/customs/error/api.js";
import { responseEnvelope } from "@/utils/responseEnvelope.js";
import { Application } from "express";


class ServiceProxy {
    
    private static serviceConfigs: ServiceConfig[] = [
        {
            path: "/api/v1/accounts/",
            name: "account-service",
            pathRewrite: { "^/": "/api/v1/accounts/" },
            url: env.ACCOUNTS_SERVICE_URL 
        },
        {
            path: "/api/v1/auth/",
            name: "auth-service",
            pathRewrite: { "^/": "/api/v1/auth/" },
            url: env.AUTH_SERVICE_URL 
        },
        {
            path: "/api/v1/transactions/",
            name: "transaction-service",
            pathRewrite: { "^/": "/api/v1/transactions/" },
            url: env.TRANSACTION_SERVICE_URL
        }
    ]

    private static createProxyOptions(service: ServiceConfig): Options {
        return {
           target: service.url,
           changeOrigin: true,
           pathRewrite: service.pathRewrite,
           timeout: service.timeout || env.DEFAULT_TIMEOUT,
           logger,
           on: {
              error: ServiceProxy.handleProxyError,
              proxyReq: ServiceProxy.handleProxyRequest,
              proxyRes: ServiceProxy.handleProxyResponse
           }
        }
    }

    private static handleProxyError(error: Error,req: any,res: any) {
        
        logger.error(`Proxy Error for ${req.path}: ${error}`);

        res.status(ERROR_CODE.SERVER_UNAVAILABLE).json(responseEnvelope({
            state: "error",
            error: {
                status: ERROR_TYPE.SERVER_UNAVAILABLE,
                code: ERROR_CODE.SERVER_UNAVAILABLE,
                detail: ERROR_TYPE.SERVER_UNAVAILABLE
            }
        }))
    }

    private static handleProxyRequest(_proxyReq: any, req: any): void {
        logger.debug(`Proxying request to ${req.path}`);
    }

    private static handleProxyResponse(_proxyRes: any, req: any): void {
        logger.debug(`Received response for ${req.path}`);
    }

    public static setupProxy(app: Application) {
        this.serviceConfigs.forEach(service => {
            const proxyOption = this.createProxyOptions(service);
            app.use(service.path,createProxyMiddleware(proxyOption));
            logger.info(`Configure proxy for ${service.name} on path ${service.path}`);
        })
    }
}

export const proxyService = (app: Application) => {
    ServiceProxy.setupProxy(app);
}