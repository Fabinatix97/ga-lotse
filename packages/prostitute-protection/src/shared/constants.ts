/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChipProps } from "@mui/joy";

import { EnumMap, buildEnumOptions } from "@eshg/lib-portal";
import {
  ApiCertificateType,
  ApiConsultation,
  ApiConsultationParagraph7,
  ApiConsultationParagraph10,
  ApiDocumentType,
  ApiPersonLanguage,
  ApiProcedureProperty,
  ApiProcedureStatus,
  ApiProcedureType,
  ApiProstituteProtectionProcedureType,
  ApiTaskType,
  ApiWaitingStatus,
} from "@eshg/prostitute-protection-api";

export const PROSTITUTE_PROTECTION_GROUP_NAME = "[System] ProstSchG-Berater";

export const systemProgressEntryTypeTitles: Record<string, string> = {
  PROCEDURE_DETAILS_MODIFIED: "Vorgangsdaten bearbeitet",
  PERSON_DETAILS_MODIFIED: "Personendaten bearbeitet",
  CONSULTATION_MODIFIED: "Beratung bearbeitet",
  REGISTRATION_CONSULTATION_CERTIFICATE_GENERATED:
    "Beratungszertifikat_Anmeldung erstellt",
  CONSULTATION_CERTIFICATE_GENERATED: "Beratungszertifikat erstellt",
  CERTIFICATE_DOWNLOADED: "Zertifikat heruntergeladen",
} as const;

export const procedureTypes = [
  ApiProcedureType.ProstituteProtectionInitial,
  ApiProcedureType.ProstituteProtectionFollowUp,
];

export const taskTypes = [ApiTaskType.ProstituteProtection];

export const keyDocumentTypes: Record<string, string> = {
  CONSULTATION_CERTIFICATE: "Beratungszertifikat",
  REGISTRATION_CONSULTATION_CERTIFICATE: "Beratungszertifikat_Anmeldung",
};

export const PERSON_FIELD_NAME = {
  firstName: "Vorname",
  lastName: "Nachname",
  dateOfBirth: "Geburtsdatum",
  alias: "Alias",
  phoneNumber: "Telefonnummer",
  otherLanguages: "Weitere Sprachen",
  gender: "Geschlecht",
  countryOfBirth: "Geburtsland",
  documentType: "Ausweisdokument",
  hasSufficientGermanLanguageSkills: "Ausreichende Deutschkenntnisse",
  customDocumentType: "Art des Ausweisdokuments",
  residencePermitValidityDate: "Gültigkeit des Aufenthaltstitels",
} as const;

export const ADDITIONAL_DATA_FIELD_NAME = {
  appointment: "Termin",
  procedureType: "Beratungstyp",
  procedureStatus: "Status",
  consultant: "Berater:in",
  consultantOfAppointmentBlock: "Berater:in von zugewiesenem Terminblock",
  createdBy: "Angelegt von",
} as const;

export const APPOINTMENT_FORM_LABELS = {
  appointmentDate: "Datum und Zeit",
  appointmentDuration: "Termindauer in Minuten",
} as const;

export const CONSULTATION_FIELD_NAME: Record<
  keyof Omit<ApiConsultation, "version" | "paragraph7" | "paragraph10">,
  string
> = {
  interpreterConsulted: "Dolmetscher hinzugezogen",
  interpreterFirstName: PERSON_FIELD_NAME.firstName,
  interpreterLastName: PERSON_FIELD_NAME.lastName,
  languageOfConsultation: "Sprache der Beratung",
} as const;

export const CONSULTATION_PARAGRAPH7_FIELD_NAME: Record<
  keyof ApiConsultationParagraph7,
  string
> = {
  legalAdvices: "Rechtsberatung",
  healthAndSocialInsurance: "Kranken- und Sozialversicherung",
  consultingServices: "Beratungsangebote",
  emergencyHelp: "Hilfe in Notsituationen",
  taxLiability: "Steuerpflicht",
  informationMaterial: "Infomaterial",
  predicament: "Notlage / Zwangslage",
} as const;

export const CONSULTATION_PARAGRAPH10_FIELD_NAME: Record<
  keyof ApiConsultationParagraph10,
  string
> = {
  diseasePrevention: "Krankheitsverhütung",
  birthControl: "Empfängnisregelung",
  pregnancy: "Schwangerschaft",
  alcoholAndDrugUsage: "Alkohol- / Drogengebrauch",
  referral: "Weitervermittlung § 19",
  clearing: "Beratungsbedarf / Clearing",
} as const;

export const DOCUMENT_TYPE_VALUES: Record<ApiDocumentType, string> = {
  [ApiDocumentType.IdentificationCard]: "Personalausweis",
  [ApiDocumentType.Passport]: "Reisepass",
  [ApiDocumentType.ResidencePermit]: "Aufenthaltstitel",
  [ApiDocumentType.TolerancePermit]: "Duldung",
  [ApiDocumentType.Other]: "Sonstige",
};

export const PROCEDURE_TYPE_VALUES: Record<
  ApiProstituteProtectionProcedureType,
  string
> = {
  [ApiProstituteProtectionProcedureType.Initial]: "Erstberatung",
  [ApiProstituteProtectionProcedureType.FollowUp]: "Folgeberatung",
} as const;

export const LANGUAGE_VALUE: Record<ApiPersonLanguage, string> = {
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

export const LANGUAGE_OPTIONS = buildEnumOptions(LANGUAGE_VALUE, false);

export const CERTIFICATE_TYPE_VALUES = {
  [ApiCertificateType._7]: "§7 Zertifikat",
  [ApiCertificateType._10]: "§10 Zertifikat",
} as const;

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

export const PROCEDURE_STATUS_VALUES: EnumMap<ApiProcedureStatus> = {
  [ApiProcedureStatus.Aborted]: "Abgebrochen",
  [ApiProcedureStatus.Closed]: "Geschlossen",
  [ApiProcedureStatus.Draft]: "Entwurf",
  [ApiProcedureStatus.InProgress]: "In Arbeit",
  [ApiProcedureStatus.Open]: "Offen",
};

export const REQUIRED_PROCEDURE_AREAS: EnumMap<string> = {
  DETAILS: "Vorgangsdaten",
  CONSULTATION_PARAGRAPH_7: "Beratung nach §7",
};

export const REQUIRED_PROCEDURE_PROPERTIES: EnumMap<ApiProcedureProperty> = {
  ALIAS: PERSON_FIELD_NAME.alias,
  FIRST_NAME: PERSON_FIELD_NAME.firstName,
  LAST_NAME: PERSON_FIELD_NAME.lastName,
  DATE_OF_BIRTH: PERSON_FIELD_NAME.dateOfBirth,
  DOCUMENT_TYPE: PERSON_FIELD_NAME.documentType,
  CUSTOM_DOCUMENT_TYPE: PERSON_FIELD_NAME.customDocumentType,
  RESIDENCE_PERMIT_VALIDITY_DATE: PERSON_FIELD_NAME.residencePermitValidityDate,
  LEGAL_ADVICES: CONSULTATION_PARAGRAPH7_FIELD_NAME.legalAdvices,
  HEALTH_AND_SOCIAL_INSURANCE:
    CONSULTATION_PARAGRAPH7_FIELD_NAME.healthAndSocialInsurance,
  CONSULTING_SERVICES: CONSULTATION_PARAGRAPH7_FIELD_NAME.consultingServices,
  EMERGENCY_HELP: CONSULTATION_PARAGRAPH7_FIELD_NAME.emergencyHelp,
  TAX_LIABILITY: CONSULTATION_PARAGRAPH7_FIELD_NAME.taxLiability,
  DISEASE_PREVENTION: CONSULTATION_PARAGRAPH10_FIELD_NAME.diseasePrevention,
  BIRTH_CONTROL: CONSULTATION_PARAGRAPH10_FIELD_NAME.birthControl,
  PREGNANCY: CONSULTATION_PARAGRAPH10_FIELD_NAME.pregnancy,
  ALCOHOL_AND_DRUG_USAGE:
    CONSULTATION_PARAGRAPH10_FIELD_NAME.alcoholAndDrugUsage,
};

export const WAITING_STATUS_VALUES: EnumMap<ApiWaitingStatus> = {
  WAITING: "Wartet",
  IN_CONSULTATION: "In Beratung",
  DONE: "Fertig",
};

export const WAITING_STATUS_OPTIONS = buildEnumOptions(
  WAITING_STATUS_VALUES,
  true,
);
