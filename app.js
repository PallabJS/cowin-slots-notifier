import { createServer } from "https";
import express from "express";
import { log, HOST, PORT } from "./settings.js";

import { startTracking } from "./tracker/trackslots.js";

// EXPRESS APP
const app = express();

// MIDDLEWARES

// HTTPS SERVER
const https = createServer(app);
https.listen(PORT, (e) => {
    if (e) {
        log.error("Error while starting server");
    } else {
        log.info(`Server is running at port: ${PORT}`);
        startTracking();
    }
});
