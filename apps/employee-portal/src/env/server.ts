/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { object, optional, parse, string } from "valibot";

import {
  EnvironmentTypeSchema,
  NodeEnvSchema,
  UrlSchema,
} from "@eshg/lib-portal/universal";

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
  NODE_ENV: NodeEnvSchema,

  PORT: optional(string(), "3000"),

  PUBLIC_ENVIRONMENT_TYPE: EnvironmentTypeSchema,

  PUBLIC_FRONTEND_URL: UrlSchema,
  PUBLIC_BASE_BACKEND_URL: UrlSchema,
  PUBLIC_INSPECTION_BACKEND_URL: UrlSchema,
  PUBLIC_SCHOOL_ENTRY_BACKEND_URL: UrlSchema,
  PUBLIC_TRAVEL_MEDICINE_BACKEND_URL: UrlSchema,
  PUBLIC_MEASLES_PROTECTION_BACKEND_URL: UrlSchema,
  PUBLIC_STATISTICS_BACKEND_URL: UrlSchema,
  PUBLIC_CHAT_MANAGEMENT_BACKEND_URL: UrlSchema,
  PUBLIC_AUDITLOG_BACKEND_URL: UrlSchema,
  PUBLIC_OPENDATA_BACKEND_URL: UrlSchema,
  PUBLIC_STI_PROTECTION_BACKEND_URL: UrlSchema,
  PUBLIC_MEDICAL_REGISTRY_BACKEND_URL: UrlSchema,
  PUBLIC_DENTAL_BACKEND_URL: UrlSchema,
  PUBLIC_OFFICIAL_MEDICAL_SERVICE_BACKEND_URL: UrlSchema,
  PUBLIC_MEDS_ABROAD_BACKEND_URL: UrlSchema,
  PUBLIC_PDF_CONVERTER_URL: UrlSchema,

  PUBLIC_MATRIX_SERVER_URL: UrlSchema,
});

// eslint-disable-next-line no-restricted-properties
export const env = parse(schema, process.env);
