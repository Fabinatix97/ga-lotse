/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiConcern,
  ApiExamination,
  ApiGender,
  ApiProcedureStatus,
  ApiProcedureType,
  ApiSexualOrientation,
  ApiTaskType,
  ApiVaccination,
} from "@eshg/employee-portal-api/stiProtection";
import { EnumMap } from "@eshg/lib-portal/types/helpers";

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
  // Todo: fill with translations
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
  [ApiAppointmentType.HivStiConsultation]: "HIV-STI-Beratung",
  [ApiAppointmentType.SexWork]: "Sexarbeit",
  [ApiAppointmentType.ResultsReview]: "Ergebnisbesprechung",
  [ApiAppointmentType.RegularExamination]: "Regeluntersuchung",
  [ApiAppointmentType.SpecialNeeds]: "Besonderer Förderbedarf",
  [ApiAppointmentType.Vaccination]: "Impfung",
};

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

export type DiseaseType = keyof ApiExamination | keyof ApiVaccination;

export const diseaseTypeNames: EnumMap<DiseaseType> = {
  chlamydia: "Chlamydien",
  gonorrhea: "Gonorrhoe (Tripper)",
  hepA: "Hepatitis A",
  hepB: "Hepatitis B",
  hepC: "Hepatitis C",
  hiv: "HIV",
  hpv: "HPV",
  syphilis: "Syphilis (Lues)",
} satisfies Record<DiseaseType, string>;
