/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

import { env } from "@/env/server";

declare module "@eshg/lib-portal/api/ApiProvider" {
  interface ApiConfiguration {
    PUBLIC_BASE_BACKEND_URL: string;
    PUBLIC_MEASLES_PROTECTION_BACKEND_URL: string;
    PUBLIC_SCHOOL_ENTRY_BACKEND_URL: string;
    PUBLIC_TRAVEL_MEDICINE_BACKEND_URL: string;
  }
}

/**
 * Caution: only expose environment variables which are not confidential!
 * All values listed here will be visible to the browser.
 */
export const API_CONFIGURATION: ApiConfiguration = {
  PUBLIC_BASE_BACKEND_URL: env.PUBLIC_BASE_BACKEND_URL,
  PUBLIC_MEASLES_PROTECTION_BACKEND_URL:
    env.PUBLIC_MEASLES_PROTECTION_BACKEND_URL,
  PUBLIC_SCHOOL_ENTRY_BACKEND_URL: env.PUBLIC_SCHOOL_ENTRY_BACKEND_URL,
  PUBLIC_TRAVEL_MEDICINE_BACKEND_URL: env.PUBLIC_TRAVEL_MEDICINE_BACKEND_URL,
};
