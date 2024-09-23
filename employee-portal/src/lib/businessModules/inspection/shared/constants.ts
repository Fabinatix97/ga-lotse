/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiProcedureType,
  ApiTaskType,
} from "@eshg/employee-portal-api/inspection";

export const procedureTypes = [ApiProcedureType.Inspection];

export const taskTypes = [
  ApiTaskType.InspectionPlanning,
  ApiTaskType.InspectionExecution,
  ApiTaskType.InspectionReport,
];

export const systemProgressEntryTypeTitles: Record<string, string> = {
  INSPECTION_ANNOUNCED: "Begehung angekündigt",
  INSPECTION_FINALIZED: "Begehung durchgeführt",
  INSPECTION_APPROVED: "Begehung freigegeben und Bericht erstellt",
};
