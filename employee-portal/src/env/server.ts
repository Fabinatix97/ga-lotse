/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { object, optional, parse, string } from "valibot";

import {
  environmentTypeSchema,
  nodeEnvSchema,
  urlSchema,
} from "@eshg/lib-portal/schemas/environment";

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

  PORT: optional(string(), "3000"),

  PUBLIC_ENVIRONMENT_TYPE: environmentTypeSchema,

  PUBLIC_FRONTEND_URL: urlSchema,
  PUBLIC_BASE_BACKEND_URL: urlSchema,
  PUBLIC_INSPECTION_BACKEND_URL: urlSchema,
  PUBLIC_SCHOOL_ENTRY_BACKEND_URL: urlSchema,
  PUBLIC_TRAVEL_MEDICINE_BACKEND_URL: urlSchema,
  PUBLIC_MEASLES_PROTECTION_BACKEND_URL: urlSchema,
  PUBLIC_STATISTICS_BACKEND_URL: urlSchema,
  PUBLIC_CHAT_MANAGEMENT_BACKEND_URL: urlSchema,
  PUBLIC_AUDITLOG_BACKEND_URL: urlSchema,
  PUBLIC_OPENDATA_BACKEND_URL: urlSchema,
  PUBLIC_STI_PROTECTION_BACKEND_URL: urlSchema,
  PUBLIC_MEDICAL_REGISTRY_BACKEND_URL: urlSchema,
  PUBLIC_DENTAL_BACKEND_URL: urlSchema,
  PUBLIC_OFFICIAL_MEDICAL_SERVICE_BACKEND_URL: urlSchema,

  PUBLIC_MATRIX_SERVER_URL: urlSchema,
});

// eslint-disable-next-line no-restricted-properties
export const env = parse(schema, process.env);
