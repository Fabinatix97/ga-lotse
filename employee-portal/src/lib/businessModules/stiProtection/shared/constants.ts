/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentStatus,
  ApiAppointmentType,
  ApiConcern,
  ApiExamination,
  ApiGender,
  ApiProcedureStatus,
  ApiProcedureType,
  ApiSexualOrientation,
  ApiTaskType,
} from "@eshg/employee-portal-api/stiProtection";
import { EnumMap } from "@eshg/lib-portal/types/helpers";
import { DefaultColorPalette } from "@mui/joy/styles/types";

export const procedureTypes = [ApiProcedureType.StiProtection];

export const taskTypes = [ApiTaskType.StiProtection];

export const PROCEDURE_STATUS_VALUES: EnumMap<ApiProcedureStatus> = {
  [ApiProcedureStatus.Aborted]: "Abgebrochen",
  [ApiProcedureStatus.Closed]: "Geschlossen",
  [ApiProcedureStatus.Draft]: "Entwurf",
  [ApiProcedureStatus.InProgress]: "In Arbeit",
  [ApiProcedureStatus.Open]: "Offen",
};

export const PROCEDURE_TYPES = [ApiProcedureType.StiProtection];

export const TASK_TYPES = [ApiTaskType.StiProtection];

export const systemProgressEntryTypeTitles: Record<string, string> = {
  PERSON_DETAILS_UPDATED: "Person aktualisiert",
  RAPID_TEST_EXAMINATION_UPDATED: "Schnelltests aktualisiert",
  LABORATORY_TEST_EXAMINATION_UPDATED: "Labortests aktualisiert",
  APPOINTMENT_REBOOKED: "Termin geändert",
  APPOINTMENT_CANCELLED: "Termin storniert",
  CONSULTATION_UPDATED: "Konsultation aktualisiert",
};

export const CONCERN_VALUES: EnumMap<ApiConcern> = {
  [ApiConcern.HivStiConsultation]: "HIV-STI Beratung",
  [ApiConcern.SexWork]: "Sexarbeit",
};

export const GENDER_VALUES: EnumMap<ApiGender> = {
  [ApiGender.Diverse]: "Divers",
  [ApiGender.Female]: "Weiblich",
  [ApiGender.Male]: "Männlich",
  [ApiGender.NotSpecified]: "Keine Angabe",
};

export const APPOINTMENT_TYPES: EnumMap<ApiAppointmentType> = {
  [ApiAppointmentType.CanChild]: "Kann-Kinder",
  [ApiAppointmentType.Consultation]: "Beratung",
  [ApiAppointmentType.EntryLevel]: "Eingangsstufe",
  [ApiAppointmentType.ProofSubmission]: "Nachweisvorlage",
  [ApiAppointmentType.HivStiConsultation]: "HIV-STI Beratung",
  [ApiAppointmentType.SexWork]: "Sexarbeit",
  [ApiAppointmentType.ResultsReview]: "Ergebnisbesprechung",
  [ApiAppointmentType.RegularExamination]: "Regeluntersuchung",
  [ApiAppointmentType.SpecialNeeds]: "Besonderer Förderbedarf",
  [ApiAppointmentType.Vaccination]: "Impfung",
  [ApiAppointmentType.OfficialMedicalService]: "Amtsärtzlicher Dienst",
};

export const APPOINTMENT_STATUS: EnumMap<ApiAppointmentStatus> = {
  [ApiAppointmentStatus.Cancelled]: "Storniert",
  [ApiAppointmentStatus.Closed]: "Abgeschlossen",
  [ApiAppointmentStatus.Open]: "Offen",
};

export const appointmentStatusColor = {
  [ApiAppointmentStatus.Cancelled]: "danger",
  [ApiAppointmentStatus.Closed]: "success",
  [ApiAppointmentStatus.Open]: "neutral",
} as const satisfies Record<ApiAppointmentStatus, DefaultColorPalette>;

export const sexualOrientationNames: EnumMap<ApiSexualOrientation> = {
  [ApiSexualOrientation.Bisexual]: "Bisexuell",
  [ApiSexualOrientation.Heterosexual]: "Heterosexuell",
  [ApiSexualOrientation.Homosexual]: "Homosexuell",
  [ApiSexualOrientation.NotSpecified]: "Sonstige",
} satisfies Record<ApiSexualOrientation, string>;

export const sexualContactNames: EnumMap<ApiGender> = {
  [ApiGender.Diverse]: "Diverse",
  [ApiGender.Female]: "Frauen",
  [ApiGender.Male]: "Männer",
  [ApiGender.NotSpecified]: "Keine Angabe",
} satisfies Record<ApiGender, string>;

export type NotEndsWith<T, K extends string> = T extends `${infer _J}${K}`
  ? never
  : T;

export type ExaminableIllnesses = NotEndsWith<keyof ApiExamination, "Date">;

export const examinableIllnessNames = {
  chlamydia: "Chlamydien",
  gonorrhea: "Gonorrhoe (Tripper)",
  hepA: "Hepatitis A",
  hepB: "Hepatitis B",
  hepC: "Hepatitis C",
  hiv: "HIV",
  syphilis: "Syphilis (Lues)",
} as const satisfies Record<ExaminableIllnesses, string>;
