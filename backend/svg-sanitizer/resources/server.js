/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express"
import bodyParser from "body-parser"
import createDOMPurify from "dompurify"
import { JSDOM } from "jsdom"
import pino from "pino"

const listenPort = Number.parseInt(process.env.PORT ?? 8080);
const bindAddress = process.env.BIND_ADDRESS ?? "::";
const healthPort = Number.parseInt(process.env.HEALTH_PORT ?? 8081);
const healthBindAddress = process.env.HEALTH_BIND_ADDRESS ?? "::";

const logger = pino();

if (listenPort === healthPort) {
  logger.error({ bindAddress, healthBindAddress },
    "health port must be different from main port");
  process.exit(1);
}

const app = express();
const healthApp = express();

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

healthApp.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const server = app.listen(listenPort, bindAddress, () => {
  logger.info(`DOMPurify server listening on ${bindAddress}:${listenPort}`);
});

const healthServer = healthApp.listen(healthPort, healthBindAddress, () => {
  logger.info(
    `Health endpoint listening on ${healthBindAddress}:${healthPort}`);
});

const shutdown = () => {
  logger.info("Shutting down...");
  healthServer.close(() => {
    logger.info("Health server closed.");
    server.close(() => {
      logger.info("Server closed.");
      process.exit(0);
    });
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
