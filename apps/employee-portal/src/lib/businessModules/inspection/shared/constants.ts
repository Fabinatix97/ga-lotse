/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiInspectionSampleEvaluationType,
  ApiInspectionSampleType,
  ApiProcedureType,
  ApiTaskType,
} from "@eshg/inspection-api";

import {
  translateInspectionSampleEvaluationType,
  translateInspectionSampleType,
} from "@/lib/businessModules/inspection/shared/enums";

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
  INSPECTION_FACILITY_UPDATED: "Geänderte Einrichtungsdaten übernommen",
  INSPECTION_FACILITY_SYNCED: "Geänderte Einrichtungsdaten übernommen",
};

export const SAMPLE_TYPE_OPTIONS = Object.values(ApiInspectionSampleType).map(
  (value) => {
    return { label: translateInspectionSampleType(value), value: value };
  },
);

export const EVALUATION_TYPE_OPTIONS = Object.values(
  ApiInspectionSampleEvaluationType,
).map((value) => {
  return {
    label: translateInspectionSampleEvaluationType(value),
    value: value,
  };
});
