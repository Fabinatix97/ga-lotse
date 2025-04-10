/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiBusinessModule,
  ApiProcedureType,
  ApiTaskStatus,
  ApiTaskType,
} from "@eshg/base-api";

export const businessModuleNames = {
  [ApiBusinessModule.Inspection]: "Begehung",
  [ApiBusinessModule.SchoolEntry]: "Einschulungsuntersuchung",
  [ApiBusinessModule.TravelMedicine]:
    "Reisemedizinische Beratung und Impfungen",
  [ApiBusinessModule.MeaslesProtection]: "Masernschutzimpfung",
  [ApiBusinessModule.StiProtection]: "HIV-STI Schutz",
  [ApiBusinessModule.MedicalRegistry]: "Medizinalaufsicht",
  [ApiBusinessModule.Dental]: "Zahnärztlicher Dienst",
  [ApiBusinessModule.OfficialMedicalService]: "Amtsärztlicher Dienst",
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
  [ApiProcedureType.MedicalRegistryEntry]: "Berufskartei-Eintrag",
  [ApiProcedureType.MedicalRegistryEmployeeDraft]:
    "Entwurf Berufskartei-Eintrag Mitarbeiter",
  [ApiProcedureType.MedicalRegistryCitizenDraft]:
    "Entwurf Berufskartei-Eintrag Bürger",
  [ApiProcedureType.DentalChild]: "Kind",
  [ApiProcedureType.OfficialMedicalService]: "Amtsärztlicher Dienst",
} satisfies Record<ApiProcedureType, string>;

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
  [ApiTaskType.OfficialMedicalService]: "Amtsärztlicher Dienst",
} satisfies Record<ApiTaskType, string>;

export const taskStatusNames = {
  [ApiTaskStatus.Closed]: "Geschlossen",
  [ApiTaskStatus.Open]: "Offen",
} satisfies Record<ApiTaskStatus, string>;
