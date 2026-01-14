/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const INSPECTION_ID = "00000000-0000-4000-8000-000000000000";
export const CHECKLIST_ID = "00000000-0000-4000-8000-000000000001";
export const CHECKBOX_ID = "00000000-0000-4000-8000-000000000002";
export const IMAGE_ID = "00000000-0000-4000-8000-000000000003";
export const AUDIO_ID = "00000000-0000-5000-8000-000000000003";
export const API_INSPECTION_INSPECTIONS_PATH = `/api/inspection/inspections/${INSPECTION_ID}`;
export const API_INSPECTION_CHECKLISTS_PATH = `/api/inspection/checklists/${INSPECTION_ID}`;
export const API_INSPECTION_CHECKLISTS_CHECKLIST_PATH = `/api/inspection/checklists/${INSPECTION_ID}/checklist/${CHECKLIST_ID}`;
export const API_INSPECTION_INSPECTIONS_FINALIZE_PATH = `/api/inspection/inspections/${INSPECTION_ID}/finalize`;
export const API_INSPECTION_INSPECTIONS_INCIDENTS_PATH = `/api/inspection/inspections/${INSPECTION_ID}/incidents`;
export const API_INSPECTION_CHECKLISTS_FILE_UPLOAD_PATH =
  "/api/inspection/checklists/file/upload";
export const API_INSPECTION_CHECKLISTS_FILE_PATH =
  "/api/inspection/checklists/file";
export const API_INSPECTION_CHECKLISTS_ID_FILE_PATH = `/api/inspection/checklists/${INSPECTION_ID}/file`;
