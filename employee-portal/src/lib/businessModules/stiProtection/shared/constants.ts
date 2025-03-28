/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EnumMap } from "@eshg/lib-portal/types/helpers";
import {
  ApiAppointmentStatus,
  ApiAppointmentType,
  ApiConcern,
  ApiExamination,
  ApiGender,
  ApiLabStatus,
  ApiProcedureStatus,
  ApiProcedureType,
  ApiSexualOrientation,
  ApiStiProcedureOrigin,
  ApiTaskType,
} from "@eshg/sti-protection-api";
import { ChipProps } from "@mui/joy";
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

export const PROCEDURE_STATUS_COLORS: EnumMap<
  ApiProcedureStatus,
  ChipProps["color"]
> = {
  [ApiProcedureStatus.Aborted]: "warning",
  [ApiProcedureStatus.Closed]: "success",
  [ApiProcedureStatus.Draft]: "neutral",
  [ApiProcedureStatus.InProgress]: "primary",
  [ApiProcedureStatus.Open]: "neutral",
};

export const PROCEDURE_TYPES = [ApiProcedureType.StiProtection];

export const TASK_TYPES = [ApiTaskType.StiProtection];

export const systemProgressEntryTypeTitles: Record<string, string> = {
  PERSON_DETAILS_UPDATED: "Person aktualisiert",
  RAPID_TEST_EXAMINATION_UPDATED: "Schnelltests aktualisiert",
  LABORATORY_TEST_EXAMINATION_UPDATED: "Labortests aktualisiert",
  APPOINTMENT_REBOOKED: "Termin geändert",
  APPOINTMENT_CANCELLED: "Termin storniert",
  APPOINTMENT_FINALIZED: "Termin abgeschlossen",
  MEDICAL_HISTORY_UPDATED: "Anamnesebogen aktualisiert",
  CITIZEN_MEDICAL_HISTORY_UPDATED: "Anamnesebogen aktualisiert",
  CONSULTATION_UPDATED: "Konsultation aktualisiert",
  DIAGNOSIS_UPDATED: "Diagnose aktualisiert",
  FOLLOW_UP_CREATED: "Folgevorgang erstellt",
};

export const CONCERN_VALUES: EnumMap<ApiConcern> = {
  [ApiConcern.HivStiConsultation]: "HIV-STI Beratung",
  [ApiConcern.SexWork]: "Sexarbeit",
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
  [ApiAppointmentType.OfficialMedicalServiceShort]: "Kleine Untersuchung",
  [ApiAppointmentType.OfficialMedicalServiceLong]: "Große Untersuchung",
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
  [ApiGender.Diverse]: "Divers",
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

export const LAB_STATUS_VALUES: EnumMap<ApiLabStatus> = {
  [ApiLabStatus.Open]: "Offen",
  [ApiLabStatus.TestsRequested]: "Tests angefordert",
  [ApiLabStatus.TestsConducted]: "Tests durchgeführt",
  [ApiLabStatus.ResultsRecorded]: "Ergebnisse eingetragen",
  [ApiLabStatus.ResultsCommunicated]: "Ergebnisse mitgeteilt",
}; // satisfies Record<ApiLabStatus, string>;

export const LAB_STATUS_COLORS: EnumMap<ApiLabStatus, ChipProps["color"]> = {
  [ApiLabStatus.Open]: "neutral",
  [ApiLabStatus.TestsRequested]: "primary",
  [ApiLabStatus.TestsConducted]: "primary",
  [ApiLabStatus.ResultsRecorded]: "primary",
  [ApiLabStatus.ResultsCommunicated]: "success",
};

export const PROCEDURE_ORIGIN_VALUES: EnumMap<ApiStiProcedureOrigin> = {
  [ApiStiProcedureOrigin.CitizenPortal]: "Bürger",
  [ApiStiProcedureOrigin.EmployeePortal]: "Mitarbeiter",
};
