/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SelectOption, buildEnumOptions } from "@eshg/lib-portal";
import {
  ApiConsultationType,
  ApiPersonLanguage,
} from "@eshg/prostitute-protection-api";

export const systemProgressEntryTypeTitles: Record<string, string> = {
  PERSON_DETAILS_UPDATED: "Antragsteller aktualisiert",
  CLOSED: "Vorgang geschlossen",
  PROCEDURE_CANCELED: "Vorgang abgebrochen",
  REOPENED: "Vorgang wiedereröffnet",
};

export const keyDocumentTypes: Record<string, string> = {
  PERSON_DETAILS_UPDATED: "Person aktualisiert.",
  CLOSED: "Vorgang geschlossen.",
  PROCEDURE_CANCELED: "Vorgang abgebrochen.",
  REOPENED: "Vorgang wiedereröffnet.",
};

// ------------------ ConsultationTopic ------------------ //
export const ConsultationTopic = {
  diseasePrevention: "DISEASE_PREVENTION",
  contraception: "CONTRACEPTION",
  pregnancy: "PREGNANCY",
  drugRisks: "DRUG_RISKS",
} as const;

export type ConsultationTopic =
  (typeof ConsultationTopic)[keyof typeof ConsultationTopic];

// ------------------ WorkEnvironment ------------------ //
export const WorkEnvironment = {
  brothel: "BROTHEL",
  club: "CLUB",
  escort: "ESCORT",
  massageSalon: "MASSAGE_SALON",
  streetProstitution: "STREET_PROSTITUTION",
  apartment: "APARTMENT",
} as const;

export type WorkEnvironment =
  (typeof WorkEnvironment)[keyof typeof WorkEnvironment];

// ------------------ MedicalReferral ------------------ //
export const MedicalReferral = {
  homanitarianClinic: "HOMANITARIAN_CLINIC",
  studentPolyclinic: "STUDENT_POLYCLINIC",
  ifsg19Measures: "IFSG_19_MEASURES",
} as const;

export type MedicalReferral =
  (typeof MedicalReferral)[keyof typeof MedicalReferral];

// ------------------ HealthInsurance ------------------ //
export const HealthInsurance = {
  insuredOnlyInHomeCountry: "INSURED_ONLY_IN_HOME_COUNTRY",
  insuredInGermany: "INSURED_IN_GERMANY",
  foreignInsuranceOnly: "FOREIGN_INSURANCE_ONLY",
  uninsured: "UNINSURED",
} as const;

export type HealthInsurance =
  (typeof HealthInsurance)[keyof typeof HealthInsurance];

export const CONSULTATION_TYPE_VALUES: Record<string, string> = {
  [ApiConsultationType.Initial]: "Erstkonsultation",
  [ApiConsultationType.FollowUp]: "Folgekonsultation",
};

export const CONSULTATION_TYPE_OPTIONS: SelectOption<string, string>[] =
  Object.values(CONSULTATION_TYPE_VALUES).map((value) => ({
    label: value,
    value,
  }));

export const CONSULTATION_TOPIC_VALUES: Record<string, string> = {
  [ConsultationTopic.diseasePrevention]: "Krankheitsprävention",
  [ConsultationTopic.contraception]: "Empfängnisverhütung",
  [ConsultationTopic.pregnancy]: "Schwangerschaft",
  [ConsultationTopic.drugRisks]: "Drogenrisiken",
};

export const CONSULTATION_TOPIC_OPTIONS: SelectOption<string, string>[] =
  Object.entries(CONSULTATION_TOPIC_VALUES).map(([key, value]) => ({
    label: value,
    value: key,
  }));

export const WORK_ENVIRONMENT_VALUES: Record<string, string> = {
  [WorkEnvironment.brothel]: "Bordell",
  [WorkEnvironment.club]: "Club",
  [WorkEnvironment.escort]: "Escort",
  [WorkEnvironment.massageSalon]: "Massagesalon",
  [WorkEnvironment.streetProstitution]: "Straßenprostitution",
  [WorkEnvironment.apartment]: "Wohnung",
};

export const WORK_ENVIRONMENT_OPTIONS: SelectOption<string, string>[] =
  Object.entries(WORK_ENVIRONMENT_VALUES).map(([key, value]) => ({
    label: value,
    value: key,
  }));

export const MEDICAL_REFERRAL_VALUES: Record<string, string> = {
  [MedicalReferral.homanitarianClinic]: "Humanitäre Klinik",
  [MedicalReferral.studentPolyclinic]: "Studentische Poliklinik",
  [MedicalReferral.ifsg19Measures]: "§19 IfSG-Maßnahmen",
};

export const MEDICAL_REFERRAL_OPTIONS: SelectOption<string, string>[] =
  Object.entries(MEDICAL_REFERRAL_VALUES).map(([key, value]) => ({
    label: value,
    value: key,
  }));

export const HEALTH_INSURANCE_VALUES: Record<string, string> = {
  [HealthInsurance.insuredOnlyInHomeCountry]: "Nur im Heimatland versichert",
  [HealthInsurance.insuredInGermany]: "In Deutschland versichert",
  [HealthInsurance.foreignInsuranceOnly]: "Nur ausländische Versicherung",
  [HealthInsurance.uninsured]: "Nicht versichert",
};

export const HEALTH_INSURANCE_OPTIONS: SelectOption<string, string>[] =
  Object.entries(HEALTH_INSURANCE_VALUES).map(([key, value]) => ({
    label: value,
    value: key,
  }));

export const LANGUAGE_VALUE = {
  [ApiPersonLanguage.Bulgarian]: "Bulgarisch",
  [ApiPersonLanguage.Chinese]: "Chinesisch",
  [ApiPersonLanguage.German]: "Deutsch",
  [ApiPersonLanguage.English]: "Englisch",
  [ApiPersonLanguage.French]: "Französisch",
  [ApiPersonLanguage.Greek]: "Griechisch",
  [ApiPersonLanguage.Italian]: "Italienisch",
  [ApiPersonLanguage.Polish]: "Polnisch",
  [ApiPersonLanguage.Portuguese]: "Portugiesisch",
  [ApiPersonLanguage.Romanian]: "Rumänisch",
  [ApiPersonLanguage.Russian]: "Russisch",
  [ApiPersonLanguage.SerboCroatian]: "Serbokroatisch",
  [ApiPersonLanguage.Slovakian]: "Slowakisch",
  [ApiPersonLanguage.Spanish]: "Spanisch",
  [ApiPersonLanguage.Thai]: "Thai",
  [ApiPersonLanguage.Czech]: "Tschechisch",
  [ApiPersonLanguage.Turkish]: "Türkisch",
  [ApiPersonLanguage.Ukrainian]: "Ukrainisch",
  [ApiPersonLanguage.Hungarian]: "Ungarisch",
  [ApiPersonLanguage.Unknown]: "Unbekannt",
} as const;

export const LANGUAGE_OPTIONS = buildEnumOptions(LANGUAGE_VALUE, true);
