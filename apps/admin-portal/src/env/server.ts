/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { object, parse } from "valibot";

import {
  EnvironmentTypeSchema,
  NodeEnvSchema,
  UrlSchema,
} from "@eshg/lib-portal/universal";

/*
 * Environment Variables exposed to the Server (Node.js)
 */
export const schema = object({
  /**
   * If the environment variable `NODE_ENV` is unassigned,
   * Next.js automatically assigns `development` when running the next dev command,
   * or `production` for all other commands.
   */
  NODE_ENV: NodeEnvSchema,

  PUBLIC_ENVIRONMENT_TYPE: EnvironmentTypeSchema,

  PUBLIC_FRONTEND_URL: UrlSchema,
});

// eslint-disable-next-line no-restricted-properties
export const env = parse(schema, process.env);
