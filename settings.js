// Load env variables
import { config as loadEnv } from "dotenv";
loadEnv();

// Logger
import logger from "simple-node-logger";
export const log = logger.createSimpleLogger("app.log");
log.setLevel("trace");

// Setting sms variables
export const sid = process.env.ACCOUNT_SID;
export const token = process.env.AUTH_TOKEN;
export const phoneNumber = process.env.NUMBER;

// SERVER SETTINGS
export const HOST = process.env.SERVER || "http://localhost";
export const PORT = process.env.PORT || 8000;
