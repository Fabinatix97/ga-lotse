/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// @ts-check
import { object, parse, picklist, pipe, string, url } from "valibot";

/*
 * Environment Variables exposed to the Server (Node.js)
 */
export const schema = object({
  /**
   * If the environment variable `NODE_ENV` is unassigned,
   * Next.js automatically assigns `development` when running the next dev command,
   * or `production` for all other commands.
   */
  NODE_ENV: picklist(["development", "production"]),
  PUBLIC_FRONTEND_URL: pipe(string(), url()),
});

// eslint-disable-next-line no-restricted-properties
export const env = parse(schema, process.env);
