/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiFollowupType,
  ApiInspPendingFacilityKind,
  ApiInspectionAnnouncementType,
  ApiInspectionPhase,
  ApiInspectionResult,
  ApiInspectionType,
  ApiWebSearchEntryStatus,
} from "@eshg/employee-portal-api/inspection";
import { ChipProps } from "@mui/joy";

export const webSearchStatusNames = {
  [ApiWebSearchEntryStatus.New]: "Neu",
  [ApiWebSearchEntryStatus.Saved]: "Gespeichert",
  [ApiWebSearchEntryStatus.Changed]: "Neue Daten!",
  [ApiWebSearchEntryStatus.Deleted]: "Gelöscht",
} satisfies Record<ApiWebSearchEntryStatus, string>;

export function translateWebSearchStatus(status: ApiWebSearchEntryStatus) {
  return webSearchStatusNames[status];
}

export const ignoredNames = {
  YES: "Ignoriert",
  NO: "Nicht ignoriert",
};

export const inspectionPendingFacilityKindNames = {
  [ApiInspPendingFacilityKind.New]: "Neu",
  [ApiInspPendingFacilityKind.Overdue]: "Überfällig",
  [ApiInspPendingFacilityKind.Pending]: "Anstehend",
} satisfies Record<ApiInspPendingFacilityKind, string>;

export function translatePendingFacilityKind(
  kind?: ApiInspPendingFacilityKind,
) {
  return kind === undefined ? "" : inspectionPendingFacilityKindNames[kind];
}

export const inspectionPhaseNames = {
  [ApiInspectionPhase.New]: "Neu",
  [ApiInspectionPhase.Planning]: "In Planung",
  [ApiInspectionPhase.ReadyForExecution]: "Bereit zur Ausführung",
  [ApiInspectionPhase.Executing]: "In Ausführung",
  [ApiInspectionPhase.Executed]: "Ausgeführt",
  [ApiInspectionPhase.CreatingReportAndInvoice]: "In Nachbereitung",
  [ApiInspectionPhase.Closed]: "Abgeschlossen",
} satisfies Record<ApiInspectionPhase, string>;

export function translateInspectionPhase(phase: ApiInspectionPhase) {
  return inspectionPhaseNames[phase];
}

const inspectionPhaseProgress = {
  [ApiInspectionPhase.New]: 0,
  [ApiInspectionPhase.Planning]: 1,
  [ApiInspectionPhase.ReadyForExecution]: 2,
  [ApiInspectionPhase.Executing]: 3,
  [ApiInspectionPhase.Executed]: 4,
  [ApiInspectionPhase.CreatingReportAndInvoice]: 5,
  [ApiInspectionPhase.Closed]: 6,
} satisfies Record<ApiInspectionPhase, number>;

export function inspectionIsBeforePhase(
  inspectionPhase: ApiInspectionPhase,
  beforePhase: ApiInspectionPhase,
) {
  return (
    inspectionPhaseProgress[inspectionPhase] <
    inspectionPhaseProgress[beforePhase]
  );
}

export const inspectionTypeNames = {
  [ApiInspectionType.Regular]: "Regulär",
  [ApiInspectionType.RegularAfterIncidents]: "Regulär nach Beanstandung",
  [ApiInspectionType.Review]: "Überprüfung",
  [ApiInspectionType.Initial]: "Erstbegehung",
  [ApiInspectionType.Complaint]: "Beschwerde",
  [ApiInspectionType.DocumentInspection]: "Dokumentenprüfung",
  [ApiInspectionType.Import]: "Import",
} satisfies Record<ApiInspectionType, string>;

export function translateInspectionType(type: ApiInspectionType) {
  return inspectionTypeNames[type];
}

export const inspectionResultNames = {
  [ApiInspectionResult.Open]: "Offen",
  [ApiInspectionResult.Successful]: "Erfolgreich",
  [ApiInspectionResult.Failed]: "Negativ",
  [ApiInspectionResult.SuccessfulWithIncidents]:
    "Erfolgreich mit Beanstandungen",
} satisfies Record<ApiInspectionResult, string>;

export function translateInspectionResult(result: ApiInspectionResult) {
  return inspectionResultNames[result];
}

export const inspectionResultColors = {
  [ApiInspectionResult.Open]: "warning",
  [ApiInspectionResult.Successful]: "success",
  [ApiInspectionResult.Failed]: "danger",
  [ApiInspectionResult.SuccessfulWithIncidents]: "primary",
} satisfies Record<ApiInspectionResult, ChipProps["color"]>;

export const followupTypeNames = {
  [ApiFollowupType.Review]: "Überprüfung",
  [ApiFollowupType.DocumentInspection]: "Dokumentenprüfung",
};

export function translateFollowupType(followupType: ApiFollowupType) {
  return followupTypeNames[followupType];
}

export const inspectionAnnouncementNames = {
  [ApiInspectionAnnouncementType.Email]: "E-Mail",
  [ApiInspectionAnnouncementType.Phone]: "Telefon",
} satisfies Record<ApiInspectionAnnouncementType, string>;

export function translateInspectionAnnouncement(
  type: ApiInspectionAnnouncementType,
) {
  return inspectionAnnouncementNames[type];
}

export const inspectionDuplicateFilterNames = {
  ["true"]: "Ja",
  ["false"]: "Nein",
} satisfies Record<string, string>;

export const inspectionBannedFacilityFilterNames = {
  ["true"]: "Ja",
  ["false"]: "Nein",
} satisfies Record<string, string>;
