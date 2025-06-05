/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiResponse } from "@eshg/inspection-api";

export const SERVICE_WORKER_SERVER_NAME = "eshg-employee-portal-service-worker";

export const uuidV4Re =
  "[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}";

export const API_CACHE_NAME = "api";
export const PAGES_CACHE_NAME = "pages";
export const PAGES_RSC_CACHE_NAME = "pages-rsc";

export const X_ESHG_INSPECTION_ID = "x-eshg-inspection-id";
export const PRE_CACHE_FOR_OFFLINE_MODE = "pre-cache-for-offline-mode";

export const PROCESS_ABORTED = "process-aborted";

export function isServiceWorkerResponse<T>(response: ApiResponse<T>): boolean {
  return response.raw.headers.get("Server") === SERVICE_WORKER_SERVER_NAME;
}
