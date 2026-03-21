import { Redis } from "ioredis";
import { env } from "./env.js";
import { logger } from "./logger.js";

class RedisClient {
    private static instance: Redis;
    private static isConnected = false;
    // Prevent outside create
    private constructor() {}

    public static getInstance() {
        if(!this.instance) {
           this.instance = new Redis(env.REDIS_URL,{
               retryStrategy: (times: number) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
               },
               maxRetriesPerRequest: 5
           });
           RedisClient.setupEventListeners();
        }
        return this.instance;
    }

    private static setupEventListeners(): void {
        RedisClient.instance.on('connect', () => {
            RedisClient.isConnected = true;
            logger.info('Connected to Redis');
        });

        RedisClient.instance.on('error', (error: any) => {
            RedisClient.isConnected = false;
            logger.error('Redis connection error:', error);
        });

        RedisClient.instance.on('close', () => {
            RedisClient.isConnected = false;
            logger.warn('Redis connection closed');
        });

        RedisClient.instance.on('reconnecting', () => {
            logger.info('Reconnecting to Redis...');
        });

        RedisClient.instance.on('ready', () => {
            logger.info('Redis client is ready');
        });

        RedisClient.instance.on('end', () => {
            RedisClient.isConnected = false;
            logger.info('Redis connection ended');
        });
    }

    public static async closeConnection () {
        if(this.instance) {
            try {
              await RedisClient.instance.quit();
              logger.info(`Redis Connection closed`);   
            } catch (error) {
              logger.error(`Redis Connection Error: ${error}`);  
            }
        }
    }

    public static isReady(): boolean {
        return RedisClient.isConnected;
    }
}

const redisInstance = RedisClient.getInstance();
export { redisInstance,RedisClient };