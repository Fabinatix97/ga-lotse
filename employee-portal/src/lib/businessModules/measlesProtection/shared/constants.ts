/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiProcedureType,
  ApiTaskType,
} from "@eshg/employee-portal-api/measlesProtection";
import { EnumMap } from "@eshg/lib-portal/types/helpers";

export const procedureTypes = [ApiProcedureType.MeaslesProtection];

export const taskTypes = [ApiTaskType.MeaslesProtection];

export const systemProgressEntryTypeTitles: Record<string, string> = {
  CASE_STATUS_CHANGED: "Bearbeitungsstand geändert",
  PROOF_SUBMITTED: "Nachweisvorlage eingetragen",
  MONETARY_FINE_ISSUED: "Bußgeld erteilt",
  ACCESS_RESTRICTION_ISSUED: "Betretungsverbot erteilt",
  ACCESS_RESTRICTION_UPDATED: "Betretungsverbot aktualisiert",
  PROOF_REQUEST_LETTER_SAVED: "Aufforderung zur Nachweisvorlage erstellt",
  APPOINTMENT_BOOKED: "Termin gebucht",
  APPOINTMENT_REBOOKED: "Termin geändert",
  APPOINTMENT_DELETED: "Termin gelöscht",
};

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
};
