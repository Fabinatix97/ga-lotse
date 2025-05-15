/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExpirationPlugin } from "workbox-expiration";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

import {
  API_CACHE_NAME,
  PAGES_CACHE_NAME,
  PAGES_RSC_CACHE_NAME,
} from "@/serviceWorker/common/common";
import { CacheableResponsePlugin } from "@/serviceWorker/sw/CacheableResponsePlugin";
import { CustomOfflineHandlerStrategy } from "@/serviceWorker/sw/CustomOfflineHandlerStrategy";
import { EncryptPlugin } from "@/serviceWorker/sw/EncryptPlugin";
import { RedirectOnErrorPlugin } from "@/serviceWorker/sw/RedirectOnErrorPlugin";
import { StripRscRequestPlugin } from "@/serviceWorker/sw/StripRscRequestPlugin";
import {
  API_INSPECTION_CHECKLISTS_CHECKLIST_PATH_PATTERN,
  API_INSPECTION_CHECKLISTS_FILE_PATH_PATTERN,
  API_INSPECTION_CHECKLISTS_FILE_UPLOAD_PATH_PATTERN,
  API_INSPECTION_FACILITIES_PENDING_PATH,
  API_INSPECTION_INSPECTIONS_FINALIZE_PATH_PATTERN,
  API_INSPECTION_PACKLISTS_PACKLIST_PATH_PATTERN,
  CACHE_RETENTION_IN_SECONDS,
  NETWORK_TIMEOUT_IN_SECONDS,
} from "@/serviceWorker/sw/config";
import { getPendingFacilities } from "@/serviceWorker/sw/inspection/controller/getPendingFacilities";
import { updateChecklistCache } from "@/serviceWorker/sw/inspection/controller/updateChecklist";
import {
  addFileToCache,
  deleteFileFromCache,
} from "@/serviceWorker/sw/inspection/controller/updateFile";
import {
  API_INSPECTION_INSPECTIONS_INCIDENT,
  API_INSPECTION_INSPECTIONS_INCIDENTS,
  addIncidentToCache,
  deleteIncidentFromCache,
  updateIncidentInCache,
} from "@/serviceWorker/sw/inspection/controller/updateIncidents";
import {
  API_INSPECTION_INSPECTIONS_INSPECTION,
  updateInspectionInCache,
} from "@/serviceWorker/sw/inspection/controller/updateInspection";
import { updatePacklistCache } from "@/serviceWorker/sw/inspection/controller/updatePacklists";
import { finalizeInspection } from "@/serviceWorker/sw/inspection/service/updateInspection";
import {
  getApiDeleteHandler,
  getApiPatchHandler,
  getApiPostHandler,
  getApiPutHandler,
} from "@/serviceWorker/sw/requestHandlers";

registerRoute(
  ({ request, url: { pathname } }) =>
    !pathname.toLowerCase().startsWith("/_next/") &&
    !pathname.toLowerCase().startsWith("/api/") &&
    !pathname.toLowerCase().split("/").slice(-1)[0]?.includes(".") &&
    request.headers.get("RSC") !== "1",
  new NetworkFirst({
    cacheName: PAGES_CACHE_NAME,
    networkTimeoutSeconds: NETWORK_TIMEOUT_IN_SECONDS,
    plugins: [
      new CacheableResponsePlugin(),
      new ExpirationPlugin({
        maxEntries: 10_000,
        maxAgeSeconds: CACHE_RETENTION_IN_SECONDS,
      }),
      new RedirectOnErrorPlugin("/~offline"),
    ],
  }),
  "GET",
);

registerRoute(
  ({ request, url: { pathname } }) =>
    !pathname.toLowerCase().startsWith("/_next/") &&
    !pathname.toLowerCase().startsWith("/api/") &&
    request.headers.get("RSC") === "1",
  new NetworkFirst({
    cacheName: PAGES_RSC_CACHE_NAME,
    networkTimeoutSeconds: NETWORK_TIMEOUT_IN_SECONDS,
    plugins: [
      new StripRscRequestPlugin(),
      new CacheableResponsePlugin(),
      new ExpirationPlugin({
        maxEntries: 10_000,
        maxAgeSeconds: CACHE_RETENTION_IN_SECONDS,
      }),
    ],
  }),
  "GET",
);

registerRoute(
  API_INSPECTION_FACILITIES_PENDING_PATH,
  new CustomOfflineHandlerStrategy(getPendingFacilities),
  "GET",
);

registerRoute(
  ({ url: { pathname } }) => pathname.toLowerCase().startsWith("/api/"),
  new NetworkFirst({
    cacheName: API_CACHE_NAME,
    networkTimeoutSeconds: NETWORK_TIMEOUT_IN_SECONDS,
    plugins: [
      new CacheableResponsePlugin(),
      new ExpirationPlugin({
        maxEntries: 10_000,
        maxAgeSeconds: CACHE_RETENTION_IN_SECONDS,
      }),
      new EncryptPlugin(),
    ],
  }),
  "GET",
);

registerRoute(
  ({ url: { pathname } }) =>
    API_INSPECTION_CHECKLISTS_CHECKLIST_PATH_PATTERN.test(pathname),
  getApiPatchHandler(updateChecklistCache),
  "PATCH",
);

registerRoute(
  ({ url: { pathname } }) =>
    API_INSPECTION_CHECKLISTS_FILE_UPLOAD_PATH_PATTERN.test(pathname),
  getApiPatchHandler(addFileToCache),
  "PATCH",
);

registerRoute(
  ({ url: { pathname } }) =>
    API_INSPECTION_CHECKLISTS_FILE_PATH_PATTERN.test(pathname),
  getApiDeleteHandler(deleteFileFromCache),
  "DELETE",
);

registerRoute(
  ({ url: { pathname } }) =>
    API_INSPECTION_PACKLISTS_PACKLIST_PATH_PATTERN.test(pathname),
  getApiPatchHandler(updatePacklistCache),
  "PATCH",
);

registerRoute(
  ({ url: { pathname } }) =>
    API_INSPECTION_INSPECTIONS_INSPECTION.test(pathname),
  getApiPostHandler(updateInspectionInCache),
  "PATCH",
);

registerRoute(
  ({ url: { pathname } }) =>
    API_INSPECTION_INSPECTIONS_INCIDENTS.test(pathname),
  getApiPostHandler(addIncidentToCache),
  "POST",
);

registerRoute(
  ({ url: { pathname } }) => API_INSPECTION_INSPECTIONS_INCIDENT.test(pathname),
  getApiPutHandler(updateIncidentInCache),
  "PUT",
);

registerRoute(
  ({ url: { pathname } }) => API_INSPECTION_INSPECTIONS_INCIDENT.test(pathname),
  getApiDeleteHandler(deleteIncidentFromCache),
  "DELETE",
);

registerRoute(
  ({ url: { pathname } }) =>
    API_INSPECTION_INSPECTIONS_FINALIZE_PATH_PATTERN.test(pathname),
  getApiPatchHandler(finalizeInspection),
  "POST",
);
