/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExpirationPlugin } from "workbox-expiration";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

import {
  GetInspectionPendingFacilityFromOfflineInspectionsResponse,
  isGetInspectionPendingFacilityFromOfflineInspectionsMessage,
} from "@/serviceWorker/common/GetInspectionPendingFacilityFromOfflineInspections";
import {
  API_CACHE_NAME,
  PAGES_CACHE_NAME,
  PAGES_RSC_CACHE_NAME,
} from "@/serviceWorker/common/common";
import { EncryptPlugin } from "@/serviceWorker/sw/EncryptPlugin";
import { FilterByCacheControlPlugin } from "@/serviceWorker/sw/FilterByCacheControlPlugin";
import { RedirectOnErrorPlugin } from "@/serviceWorker/sw/RedirectOnErrorPlugin";
import { StripRscRequestPlugin } from "@/serviceWorker/sw/StripRscRequestPlugin";
import {
  API_INSPECTION_CHECKLISTS_CHECKLIST_PATH_PATTERN,
  API_INSPECTION_CHECKLISTS_FILE_PATH_PATTERN,
  API_INSPECTION_CHECKLISTS_FILE_UPLOAD_PATH_PATTERN,
  API_INSPECTION_INSPECTIONS_FINALIZE_PATH_PATTERN,
  API_INSPECTION_PACKLISTS_PACKLIST_PATH_PATTERN,
  NETWORK_TIMEOUT_IN_SECONDS,
} from "@/serviceWorker/sw/config";
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
import { getFacilities } from "@/serviceWorker/sw/inspection/service/getFacilities";
import { finalizeInspection } from "@/serviceWorker/sw/inspection/service/updateInspection";
import {
  getApiDeleteHandler,
  getApiPatchHandler,
  getApiPostHandler,
  getApiPutHandler,
} from "@/serviceWorker/sw/requestHandlers";
import { getGlobalSelf } from "@/serviceWorker/sw/util";

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
      new FilterByCacheControlPlugin(),
      new ExpirationPlugin({
        maxEntries: 10_000,
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
      new FilterByCacheControlPlugin(),
      new ExpirationPlugin({
        maxEntries: 10_000,
      }),
    ],
  }),
  "GET",
);

registerRoute(
  ({ url: { pathname } }) => pathname.toLowerCase().startsWith("/api/"),
  new NetworkFirst({
    cacheName: API_CACHE_NAME,
    networkTimeoutSeconds: NETWORK_TIMEOUT_IN_SECONDS,
    plugins: [
      new FilterByCacheControlPlugin(),
      new ExpirationPlugin({
        maxEntries: 10_000,
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

getGlobalSelf().addEventListener("message", (event: ExtendableMessageEvent) => {
  if (event.origin !== self.origin) return;
  if (isGetInspectionPendingFacilityFromOfflineInspectionsMessage(event.data)) {
    getFacilities(event.data.inspectionIds).then(
      (facilities) => {
        const response: GetInspectionPendingFacilityFromOfflineInspectionsResponse =
          {
            type: "getInspectionPendingFacilityFromOfflineInspections",
            facilities,
          };

        event.ports[0]?.postMessage(response);
      },
      (reason) => {
        throw reason;
      },
    );
  }
});
