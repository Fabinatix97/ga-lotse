/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiBusinessModule,
  ApiProcedureStatus,
  ApiProcedureType,
  ApiTaskStatus,
  ApiTaskType,
} from "@eshg/employee-portal-api/base";
import { ChipProps } from "@mui/joy";

export const businessModuleNames = {
  [ApiBusinessModule.Inspection]: "Begehung",
  [ApiBusinessModule.SchoolEntry]: "Einschulungsuntersuchung",
  [ApiBusinessModule.TravelMedicine]:
    "Reisemedizinische Beratung und Impfungen",
  [ApiBusinessModule.MeaslesProtection]: "Masernschutzimpfung",
  [ApiBusinessModule.StiProtection]: "HIV-STI Schutz",
  [ApiBusinessModule.MedicalRegistry]: "Medizinalkartei",
  [ApiBusinessModule.Dental]: "Zahnärztlicher Dienst",
} satisfies Record<ApiBusinessModule, string>;

export const procedureTypeNames = {
  [ApiProcedureType.RegularExamination]: "Regelkind",
  [ApiProcedureType.CanChild]: "Kann-Kind",
  [ApiProcedureType.EntryLevel]: "Eingangsstufe",
  [ApiProcedureType.Inspection]: "Begehung",
  [ApiProcedureType.DraftCitizenOfficeImport]: "Entwurf Bürgeramtsliste",
  [ApiProcedureType.DraftSchoolImport]: "Entwurf Schulliste",
  [ApiProcedureType.TmVaccinationConsultation]: "Impfberatung",
  [ApiProcedureType.MeaslesProtection]: "Masernschutzimpfung",
  [ApiProcedureType.StiProtection]: "HIV-STI-Schutz",
  [ApiProcedureType.MedicalRegistryEntry]: "Medizinalkarteieintrag",
  [ApiProcedureType.MedicalRegistryEmployeeDraft]:
    "Entwurf Medizinalkarteieintrag Mitarbeiter",
  [ApiProcedureType.MedicalRegistryCitizenDraft]:
    "Entwurf Medizinalkarteieintrag Bürger",
} satisfies Record<ApiProcedureType, string>;

export const procedureStatusNames = {
  [ApiProcedureStatus.Aborted]: "Abgebrochen",
  [ApiProcedureStatus.Closed]: "Geschlossen",
  [ApiProcedureStatus.Draft]: "Entwurf",
  [ApiProcedureStatus.InProgress]: "in Arbeit",
  [ApiProcedureStatus.Open]: "Offen",
} satisfies Record<ApiProcedureStatus, string>;

export const statusColors = {
  [ApiProcedureStatus.Aborted]: "warning",
  [ApiProcedureStatus.Closed]: "success",
  [ApiProcedureStatus.Draft]: "neutral",
  [ApiProcedureStatus.InProgress]: "primary",
  [ApiProcedureStatus.Open]: "warning",
} satisfies Record<ApiProcedureStatus, ChipProps["color"]>;

export const taskTypeNames = {
  [ApiTaskType.BookAppointment]: "Termin vereinbaren",
  [ApiTaskType.PerformSchoolEntryExamination]:
    "Einschulungsuntersuchung durchführen",
  [ApiTaskType.InspectionPlanning]: "Begehung planen",
  [ApiTaskType.InspectionExecution]: "Begehung durchführen",
  [ApiTaskType.InspectionReport]: "Begehungsbericht erstellen",
  [ApiTaskType.TravelMedicine]: "Reisemedizinische Beratung und Impfungen",
  [ApiTaskType.MeaslesProtection]: "Masernschutzimpfung",
  [ApiTaskType.StiProtection]: "HIV-STI-Schutz",
} satisfies Record<ApiTaskType, string>;

export const taskStatusNames = {
  [ApiTaskStatus.Closed]: "Geschlossen",
  [ApiTaskStatus.Open]: "Offen",
} satisfies Record<ApiTaskStatus, string>;
