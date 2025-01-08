/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiCreatedByUserType,
} from "@eshg/employee-portal-api/travelMedicine";
import { EnumMap } from "@eshg/lib-portal/types/helpers";

export const APPOINTMENT_TYPES: EnumMap<ApiAppointmentType> = {
  [ApiAppointmentType.Consultation]: "Beratung",
  [ApiAppointmentType.Vaccination]: "Impfung",
  [ApiAppointmentType.RegularExamination]: "Regeluntersuchung",
  [ApiAppointmentType.CanChild]: "Kann-Kinder",
  [ApiAppointmentType.EntryLevel]: "Eingangsstufe",
  [ApiAppointmentType.SpecialNeeds]: "Besonderer Förderbedarf",
  [ApiAppointmentType.ProofSubmission]: "Nachweisvorlage",
  [ApiAppointmentType.HivStiConsultation]: "HIV-STI-Beratung",
  [ApiAppointmentType.SexWork]: "Sexarbeit",
  [ApiAppointmentType.ResultsReview]: "Ergebnisbesprechung",
  [ApiAppointmentType.OfficialMedicalService]: "Amtsärtzlicher Dienst",
};

export const CREATED_BY_USER_TYPES: EnumMap<ApiCreatedByUserType> = {
  [ApiCreatedByUserType.Employee]: "Mitarbeiter",
  [ApiCreatedByUserType.CitizenPortal]: "Bürger",
};

export function translateAppointmentType(type: ApiAppointmentType) {
  return APPOINTMENT_TYPES[type];
}

export function translateCreatedByUserType(type: ApiCreatedByUserType) {
  return CREATED_BY_USER_TYPES[type];
}
