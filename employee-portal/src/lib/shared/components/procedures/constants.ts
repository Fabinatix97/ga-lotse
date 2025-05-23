/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiBusinessModule, ApiTaskStatus, ApiTaskType } from "@eshg/base-api";
import { DENTAL_MODULE_NAME } from "@eshg/dental";

export const businessModuleNames = {
  [ApiBusinessModule.Inspection]: "Begehung",
  [ApiBusinessModule.SchoolEntry]: "Einschulungsuntersuchung",
  [ApiBusinessModule.TravelMedicine]:
    "Reisemedizinische Beratung und Impfungen",
  [ApiBusinessModule.MeaslesProtection]: "Masernschutzimpfung",
  [ApiBusinessModule.StiProtection]: "HIV-STI Schutz",
  [ApiBusinessModule.MedicalRegistry]: "Medizinalaufsicht",
  [ApiBusinessModule.Dental]: DENTAL_MODULE_NAME,
  [ApiBusinessModule.OfficialMedicalService]: "Amtsärztlicher Dienst",
  [ApiBusinessModule.MedsAbroad]: "Reisen mit BtM",
} satisfies Record<ApiBusinessModule, string>;

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
  [ApiTaskType.MedsAbroad]: "Reisen mit BtM",
} satisfies Record<ApiTaskType, string>;

export const taskStatusNames = {
  [ApiTaskStatus.Closed]: "Geschlossen",
  [ApiTaskStatus.Open]: "Offen",
} satisfies Record<ApiTaskStatus, string>;
