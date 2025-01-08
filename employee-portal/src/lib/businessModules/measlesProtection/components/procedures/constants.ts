/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCaseStatus,
  ApiMPFacilityType,
  ApiMeasure,
  ApiProofRequestSent,
  ApiReportingReason,
  ApiRoleStatus,
  ApiSubmissionResult,
} from "@eshg/employee-portal-api/measlesProtection";

export const facilityTypeNames: Record<ApiMPFacilityType, string> = {
  [ApiMPFacilityType.School]: "Schule",
  [ApiMPFacilityType.DayNursery]: "Kindertageseinrichtung und Kinderhort",
  [ApiMPFacilityType.Daycare]: "Kindertagespflege",
  [ApiMPFacilityType.ChildrensHome]: "Heim",
  [ApiMPFacilityType.RefugeeAccommodation]:
    "Gemeinschaftsunterkunft für Geflüchtete",
  [ApiMPFacilityType.Hospital]: "Krankenhaus",
  [ApiMPFacilityType.MedicalPractice]:
    "Arztpraxis, Zahnarztpraxis oder psychotherapeutische Praxis",
  [ApiMPFacilityType.OutpatientSurgery]: "Einrichtung für ambulantes Operieren",
  [ApiMPFacilityType.RehabilitationCentre]:
    "Vorsorge- oder Rehabilitationseinrichtung",
  [ApiMPFacilityType.DialysisCentre]: "Dialyseeinrichtung",
  [ApiMPFacilityType.DayClinic]: "Tagesklinik",
  [ApiMPFacilityType.MaternityCentre]: "Entbindungseinrichtung",
  [ApiMPFacilityType.OtherMedicalPractice]:
    "Praxis sonstiger humanmedizinischer Heilberufe",
  [ApiMPFacilityType.PublicHealthService]:
    "Einrichtung des öffentlichen Gesundheitsdienstes",
  [ApiMPFacilityType.EmergencyService]: "Rettungsdienst",
  [ApiMPFacilityType.CivilProtection]:
    "Einrichtung des Zivil- und Katastrophenschutzes",
  [ApiMPFacilityType.Other]: "Andere",
};

export const roleStatusNames: Record<ApiRoleStatus, string> = {
  [ApiRoleStatus.Employee]: "Beschäftigte:r",
  [ApiRoleStatus.Supervised]: "Betreut / Bewohner:in",
};

export const reportingReasonNames: Record<ApiReportingReason, string> = {
  [ApiReportingReason.FirstVaccine]: "nur 1. Impfung",
  [ApiReportingReason.MedicalContraindication]:
    "med. Kontraindikation / Attest",
  [ApiReportingReason.NoProof]: "ohne Nachweis",
  [ApiReportingReason.Other]: "anderer Grund",
  [ApiReportingReason.UnassessableProof]:
    "Nachweis nicht beurteilbar (z.B. unleserlich, Fremdsprache)",
};

export const caseStatusNames: Record<ApiCaseStatus, string> = {
  [ApiCaseStatus.AccessRestricted]: "Betretungsverbot erteilt",
  [ApiCaseStatus.AppointmentBooked]: "Termin vereinbart",
  [ApiCaseStatus.AttendedNoProof]:
    "Termin wahrgenommen, keinen gültigen Nachweis erbracht",
  [ApiCaseStatus.AuthorityHandover]: "Abgabe an das Ordnungsamt",
  [ApiCaseStatus.FollowUpAppointment]: "Folgetermin vereinbart",
  [ApiCaseStatus.FollowUpLetterSend]: "Folgeanschreiben versendet",
  [ApiCaseStatus.IndividualReview]: "Individuelle Prüfung",
  [ApiCaseStatus.LetterSend]: "Initiales Anschreiben versendet",
  [ApiCaseStatus.MedicalAttest]:
    "Attest über dauerhafte Kontraindikation vorgelegt",
  [ApiCaseStatus.PersonNotActive]:
    "Person nicht mehr in der Einrichtung tätig/betreut",
  [ApiCaseStatus.PersonTempNotActive]:
    "Person längerfristig nicht in der Einrichtung tätig/betreut",
  [ApiCaseStatus.ProcedureRecorded]: "Vorgang erfasst",
  [ApiCaseStatus.ProcedureValidation]: "Vorgangsprüfung",
  [ApiCaseStatus.ProofSubmitted]: "Gültiger Nachweis vorgelegt",
  [ApiCaseStatus.ReportWithdrawn]: "Meldung von Einrichtung zurückgenommen",
  [ApiCaseStatus.TempMedicalAttest]: "Zeitlich befristetes Attest vorgelegt",
};

export const measureNames: Record<ApiMeasure, string> = {
  [ApiMeasure.AccessRestriction]: "Betretungsverbot",
  [ApiMeasure.MonetaryFine]: "Bußgeld",
};

export const proofRequestSentNames: Record<ApiProofRequestSent, string> = {
  [ApiProofRequestSent.FirstLetter]: "Erstes Anschreiben",
  [ApiProofRequestSent.FollowUpLetter]: "Folgeanschreiben",
};

export const submissionResultLabels: Record<ApiSubmissionResult, string> = {
  [ApiSubmissionResult.ProofSubmitted]: "Gültiger Nachweis vorgelegt",
  [ApiSubmissionResult.UnderReview]: "Nachweis in Prüfung",
  [ApiSubmissionResult.AttendedNoProof]:
    "Termin wahrgenommen, keinen gültigen Nachweis erbracht",
  [ApiSubmissionResult.MedicalAttest]:
    "Attest über dauerhafte Kontraindikation vorgelegt",
  [ApiSubmissionResult.TempMedicalAttest]:
    "Zeitlich befristetes Attest vorgelegt",
};

export const submissionResultOptions = Object.entries(
  submissionResultLabels,
).map(([value, label]) => ({
  label,
  value: value as ApiSubmissionResult,
}));

export const LetterType = {
  LetterToPatient: "LETTER_TO_PATIENT",
  LetterToCustodian: "LETTER_TO_CUSTODIAN",
  LetterToFacility: "LETTER_TO_FACILITY",
} as const;
export type LetterType = (typeof LetterType)[keyof typeof LetterType];

export const letterTypeLabels: Record<LetterType, string> = {
  LETTER_TO_PATIENT: "Anschreiben an betroffene Person",
  LETTER_TO_CUSTODIAN: "Anschreiben an Personsorgeberechtigte",
  LETTER_TO_FACILITY: "Anschreiben an Einrichtung",
};

export const LetterCreationType = {
  Manual: "MANUAL",
  Automatic: "AUTOMATIC",
} as const;
export type LetterCreationType =
  (typeof LetterCreationType)[keyof typeof LetterCreationType];

export const letterCreationTypeLabels = {
  AUTOMATIC: "Neues Anschreiben erzeugen",
  MANUAL: "Versendetes Anschreiben hochladen",
} as const;

export const letterCreationTypeOptions = Object.entries(
  letterCreationTypeLabels,
).map(([value, label]) => ({
  label,
  value,
}));

export const letterTypeOptions = Object.entries(letterTypeLabels).map(
  ([value, label]) => ({
    label,
    value,
  }),
);

export const letterTypeOptionsWithoutCustodian = Object.entries(
  letterTypeLabels,
)
  .filter(([value]) => value !== LetterType.LetterToCustodian)
  .map(([value, label]) => ({
    label,
    value,
  }));
