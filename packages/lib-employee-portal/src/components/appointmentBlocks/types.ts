/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export const ApiDayOfWeek = {
  Monday: "MONDAY",
  Tuesday: "TUESDAY",
  Wednesday: "WEDNESDAY",
  Thursday: "THURSDAY",
  Friday: "FRIDAY",
  Saturday: "SATURDAY",
  Sunday: "SUNDAY",
} as const;
export type ApiDayOfWeek = (typeof ApiDayOfWeek)[keyof typeof ApiDayOfWeek];

export const ApiAppointmentType = {
  Consultation: "CONSULTATION",
  Vaccination: "VACCINATION",
  RegularExamination: "REGULAR_EXAMINATION",
  CanChild: "CAN_CHILD",
  EntryLevel: "ENTRY_LEVEL",
  SpecialNeeds: "SPECIAL_NEEDS",
  ProofSubmission: "PROOF_SUBMISSION",
  HivStiConsultation: "HIV_STI_CONSULTATION",
  SexWork: "SEX_WORK",
  ResultsReview: "RESULTS_REVIEW",
  OfficialMedicalServiceShort: "OFFICIAL_MEDICAL_SERVICE_SHORT",
  OfficialMedicalServiceLong: "OFFICIAL_MEDICAL_SERVICE_LONG",
  MedsAbroadCertification: "MEDS_ABROAD_CERTIFICATION",
} as const;
export type ApiAppointmentType =
  (typeof ApiAppointmentType)[keyof typeof ApiAppointmentType];
