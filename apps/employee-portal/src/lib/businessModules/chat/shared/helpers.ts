/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { env } from "@/env/client";

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const logger = (() => {
  const isDev = env.NODE_ENV !== "production";

  function print(type: string, ...messages: any[]) {
    if (isDev) {
      switch (type) {
        case "info":
          console.info(
            "%c CHAT INFO:",
            "background: blue; color: white;",
            ...messages,
          );
          break;
        case "warn":
          console.log(
            "%c CHAT WARN:",
            "background: #d96200; color: white;",
            ...messages,
          );
          break;
        case "error":
          console.error(
            "%c CHAT ERROR:",
            "background: red; color: white;",
            ...messages,
          );
          break;
        case "softError":
          console.log(
            "%c CHAT ERROR:",
            "background: red; color: white;",
            ...messages,
          );
          break;
        case "trace":
          console.trace(
            "%c CHAT TRACE:",
            "background: grey; color: black;",
            ...messages,
          );
          break;
        case "debug":
        default:
          console.log(
            "%c CHAT LOG:",
            "background: #474747; color: white;",
            ...messages,
          );
      }
    }
  }

  return {
    debug: print.bind(null, "debug"),
    info: print.bind(null, "info"),
    warn: print.bind(null, "warn"),
    error: print.bind(null, "error"),
    softError: print.bind(null, "softError"),
    trace: print.bind(null, "trace"),
  };
})();
