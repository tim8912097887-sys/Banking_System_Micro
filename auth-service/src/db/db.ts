import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '@configs/env.js';
import { logger } from '@configs/logger.js';

class DatabaseServer {
    private static db: NodePgDatabase;
    private static pool: Pool;
    constructor() {}

    public static getInstance() {
        
        if(!DatabaseServer.db) {
            // Create the pool separately so we can export it
            DatabaseServer.pool = new Pool({
            connectionString: env.DATABASE_URL,
            connectionTimeoutMillis: 5000,
            statement_timeout: 10000,
            query_timeout: 12000,
            max: 15,
            min: 2,
            idleTimeoutMillis: 5000,
            });
            DatabaseServer.db = drizzle(DatabaseServer.pool, { casing: 'snake_case' });
            this.setupEventListeners();
        }
        return DatabaseServer.db;
    }

    private static setupEventListeners(): void {
        
        // Handle event
        DatabaseServer.pool.on("connect",() => {
            logger.info(`Database Connection: Success`);
        })
        DatabaseServer.pool.on("error",(error: any) => {
            logger.error(`Database Error: ${error}`);
        })
        DatabaseServer.pool.on("acquire",() => {
            logger.info(`Database Pool: Client acquire`);
        })
        DatabaseServer.pool.on("release",() => {
            logger.info(`Database Pool: Client Release`);
        })
        DatabaseServer.pool.on("remove",() => {
            logger.info(`Database Pool: Client Remove`);
        })
    }

    //Handle Disconnection
    public static async dbDisconnection() {
        await DatabaseServer.pool.end();
    }
}

const dbInstance = DatabaseServer.getInstance();
export { DatabaseServer,dbInstance };