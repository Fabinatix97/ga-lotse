/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureType, ApiTaskType } from "@eshg/school-entry-api";

export const procedureTypes = [
  ApiProcedureType.RegularExamination,
  ApiProcedureType.CanChild,
  ApiProcedureType.DraftCitizenOfficeImport,
  ApiProcedureType.DraftSchoolImport,
];

export const taskTypes = [
  ApiTaskType.BookAppointment,
  ApiTaskType.PerformSchoolEntryExamination,
];

export const systemProgressEntryTypeTitles: Record<string, string> = {
  MERGED_DATA_FROM_SCHOOL_LIST: "Mit Daten aus dem Schullisten-Import ergänzt",
  MERGED_DATA_FROM_CITIZEN_LIST:
    "Mit Daten aus dem Bürgeramtslisten-Import ergänzt",
  SCHOOL_MODIFIED: "Schule bearbeitet",
  LABELS_MODIFIED: "Kennungen bearbeitet",
  CHILD_MODIFIED: "Kind bearbeitet",
  CHILD_SYNCED_WITH_CENTRAL_FILE: "Änderung Kind übernommen",
  CUSTODIAN_SYNCED_WITH_CENTRAL_FILE: "Änderung PSB übernommen",
  CUSTODIAN_ADDED: "PSB angelegt",
  CUSTODIAN_MODIFIED: "PSB bearbeitet",
  CUSTODIAN_REMOVED: "PSB entfernt",
  APPOINTMENT_MODIFIED: "Termin bearbeitet",
  APPOINTMENT_RESCHEDULED_BY_CITIZEN: "Termin von Bürger:in verschoben",
  HEARING_TEST_MODIFIED: "Hörscreening bearbeitet",
  EYE_EXAMINATION_MODIFIED: "Sehscreening bearbeitet",
  SOPESS_EXAMINATION_MODIFIED: "S1 SOPESS bearbeitet",
  DEVELOPMENT_SCREENING_MODIFIED: "S1 Befund bearbeitet",
  VACCINATION_STATUS_MODIFIED: "Impfstatus bearbeitet",
  ANAMNESIS_MODIFIED: "Anamnese bearbeitet",
  ANAMNESIS_ADDED_BY_CITIZEN: "Anamnese von Bürger:in ausgefüllt",
  MEDICAL_REPORT_GENERATED: "Arztbrief erstellt",
  SCHOOL_INFO_LETTER_GENERATED: "Schulinfobrief erstellt",
};

export const keyDocumentTypes: Record<string, string> = {
  INVITATION: "Einladung",
  SCHOOL_INFO_LETTER: "Schulinfobrief",
};
