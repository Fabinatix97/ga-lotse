/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { uuidV4Re } from "@/serviceWorker/common/common";

export const NETWORK_TIMEOUT_IN_SECONDS = 10;
export const CACHE_RETENTION_IN_MINUTES = 7 * 24 * 60;
export const CACHE_RETENTION_IN_SECONDS = CACHE_RETENTION_IN_MINUTES * 60;
export const KEY_TIMEOUT_IN_MS = 10 * 60 * 1000; // 10 minutes

export const API_INSPECTION_FACILITIES_PENDING_PATH =
  "/api/inspection/facilities/pending";
export const API_INSPECTION_INSPECTIONS_FINALIZE_PATH_PATTERN = new RegExp(
  `^/api/inspection/inspections/(?<inspectionId>${uuidV4Re})/finalize$`,
  "i",
);
export const API_INSPECTION_CHECKLISTS_CHECKLIST_PATH_PATTERN = new RegExp(
  `^/api/inspection/checklists/(?<inspectionId>${uuidV4Re})/checklist/(?<checklistId>${uuidV4Re})$`,
  "i",
);
export const API_INSPECTION_CHECKLISTS_FILE_UPLOAD_PATH_PATTERN =
  /^\/api\/inspection\/checklists\/file\/upload$/i;
export const API_INSPECTION_CHECKLISTS_FILE_PATH_PATTERN = new RegExp(
  `^/api/inspection/checklists/(?<inspectionId>${uuidV4Re})/file/(?<fileId>${uuidV4Re})$`,
  "i",
);
export const API_INSPECTION_PACKLISTS_PACKLIST_PATH_PATTERN = new RegExp(
  `^/api/inspection/packlists/(?<inspectionId>${uuidV4Re})/packlist/(?<packlistId>${uuidV4Re})/(?<packlistElementId>${uuidV4Re})$`,
  "i",
);
