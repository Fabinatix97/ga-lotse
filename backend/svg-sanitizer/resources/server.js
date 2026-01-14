/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express"
import bodyParser from "body-parser"
import createDOMPurify from "dompurify"
import { JSDOM } from "jsdom"
import pino from "pino"

const listenPort = process.env.PORT ?? 8080;

const logger = pino();

const app = express();
app.use(bodyParser.text({ type: "*/*", limit: "1mb" }));

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, "Incoming request");
  next();
});

app.post("/sanitize", (req, res) => {
  try {
    const dirty = req.body;
    const clean = DOMPurify.sanitize(dirty, { USE_PROFILES: { svg: true } });

    logger.info({
      event: "sanitize",
      inputSize: dirty.length,
      outputSize: clean.length,
    }, "Sanitized SVG");

    res.type("image/svg+xml").send(clean);
  } catch (err) {
    logger.error({ err, event: "sanitize" }, "Sanitization failed");
    res.status(400).send("Invalid input");
  }
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const server = app.listen(listenPort, () => {
  logger.info(`DOMPurify server listening on port ${listenPort}`);
});

const shutdown = () => {
  logger.info("Shutting down...");
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
