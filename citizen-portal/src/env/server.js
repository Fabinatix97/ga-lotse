/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// @ts-check
import {
  deploymentTypeSchema,
  environmentTypeSchema,
  nodeEnvSchema,
  urlSchema,
} from "@eshg/lib-portal/schemas/environment";
import { object, optional, parse, string } from "valibot";

/*
 * Environment Variables exposed to the Server (Node.js)
 *
 * Environment variables exposed to the Client using a React Context should be prefixed with PUBLIC_ to avoid leaking sensitive data.
 */
const schema = object({
  /**
   * If the environment variable `NODE_ENV` is unassigned,
   * Next.js automatically assigns `development` when running the next dev command,
   * or `production` for all other commands.
   */
  NODE_ENV: nodeEnvSchema,

  PUBLIC_ENVIRONMENT_TYPE: environmentTypeSchema,
  PUBLIC_DEPLOYMENT_TYPE: deploymentTypeSchema,

  PORT: optional(string(), "3001"),

  PUBLIC_FRONTEND_URL: urlSchema,
  PUBLIC_BASE_BACKEND_URL: urlSchema,
  PUBLIC_MEASLES_PROTECTION_BACKEND_URL: urlSchema,
  PUBLIC_SCHOOL_ENTRY_BACKEND_URL: urlSchema,
  PUBLIC_TRAVEL_MEDICINE_BACKEND_URL: urlSchema,
  PUBLIC_OFFICIAL_MEDICAL_SERVICE_BACKEND_URL: urlSchema,
  PUBLIC_MEDICAL_REGISTRY_BACKEND_URL: urlSchema,
  PUBLIC_OPEN_DATA_BACKEND_URL: urlSchema,

  MARKDOWN_PAGE_DIRECTORY: string(),
});

// eslint-disable-next-line no-restricted-properties
export const env = parse(schema, process.env);
