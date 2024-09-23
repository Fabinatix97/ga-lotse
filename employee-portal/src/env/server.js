/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// @ts-check
import { object, optional, parse, picklist, pipe, string, url } from "valibot";

/*
 * Environment Variables exposed to the Server (Node.js)
 */
const schema = object({
  /**
   * If the environment variable `NODE_ENV` is unassigned,
   * Next.js automatically assigns `development` when running the next dev command,
   * or `production` for all other commands.
   */
  NODE_ENV: picklist(["development", "production"]),

  PORT: optional(string(), "3000"),

  PUBLIC_FRONTEND_URL: pipe(string(), url()),
  PUBLIC_BASE_BACKEND_URL: pipe(string(), url()),
  PUBLIC_INSPECTION_BACKEND_URL: pipe(string(), url()),
  PUBLIC_SCHOOL_ENTRY_BACKEND_URL: pipe(string(), url()),
  PUBLIC_TRAVEL_MEDICINE_BACKEND_URL: pipe(string(), url()),
  PUBLIC_MEASLES_PROTECTION_BACKEND_URL: pipe(string(), url()),
  PUBLIC_STATISTICS_BACKEND_URL: pipe(string(), url()),
  PUBLIC_CHAT_MANAGEMENT_BACKEND_URL: pipe(string(), url()),
  PUBLIC_AUDITLOG_BACKEND_URL: pipe(string(), url()),
  PUBLIC_STI_PROTECTION_BACKEND_URL: pipe(string(), url()),

  MATRIX_SERVER_URL: pipe(string(), url()),
});

// eslint-disable-next-line no-restricted-properties
export const env = parse(schema, process.env);
