/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// @ts-check
import {
  environmentTypeSchema,
  nodeEnvSchema,
  urlSchema,
} from "@eshg/lib-portal/schemas/environment";
import { object, parse } from "valibot";

/*
 * Environment Variables exposed to the Server (Node.js)
 */
export const schema = object({
  /**
   * If the environment variable `NODE_ENV` is unassigned,
   * Next.js automatically assigns `development` when running the next dev command,
   * or `production` for all other commands.
   */
  NODE_ENV: nodeEnvSchema,

  PUBLIC_ENVIRONMENT_TYPE: environmentTypeSchema,

  PUBLIC_FRONTEND_URL: urlSchema,
});

// eslint-disable-next-line no-restricted-properties
export const env = parse(schema, process.env);
