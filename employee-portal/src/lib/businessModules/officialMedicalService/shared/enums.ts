/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureStatus } from "@eshg/base-api";
import { EnumMap } from "@eshg/lib-portal/types/helpers";
import {
  ApiAddiction,
  ApiCurrentMedicalCondition,
  ApiEatingDisorder,
  ApiFillingPerson,
  ApiHeartDisease,
  ApiMaritalStatus,
  ApiMentalIllness,
  ApiOpticalAidAnswer,
  ApiThyroidDisease,
  ApiYesNoDontKnowAnswer,
} from "@eshg/official-medical-service-api";

import { procedureStatusNames } from "@/lib/baseModule/api/procedures/enums";

export const omsProcedureAssignedFilterNames = {
  ["true"]: "Nur mir zugewiesene Fälle",
} satisfies Record<string, string>;

export const omsProcedureStatusFilterNames = {
  [ApiProcedureStatus.Draft]: procedureStatusNames[ApiProcedureStatus.Draft],
  [ApiProcedureStatus.Open]: procedureStatusNames[ApiProcedureStatus.Open],
  [ApiProcedureStatus.InProgress]:
    procedureStatusNames[ApiProcedureStatus.InProgress],
} satisfies Record<string, string>;

export const omsProcedureUrgentFilterNames = {
  ["true"]: "Nur dringende Fälle",
} satisfies Record<string, string>;

export const FILLING_PERSON_VALUES: EnumMap<ApiFillingPerson> = {
  [ApiFillingPerson.Employee]:
    "Der Bogen wird von einem / einer Mitarbeiter:in des Gesundheitsamts ausgefüllt.",
  [ApiFillingPerson.AffectedPerson]:
    "Die betroffene Person füllt diesen Bogen selbst aus.",
  [ApiFillingPerson.LegalGuardian]:
    "Der Bogen wird von einem / einer gesetzlichen Vertreter:in ausgefüllt.",
};
export const MARITAL_STATUS_VALUES: EnumMap<ApiMaritalStatus> = {
  [ApiMaritalStatus.Unmarried]: "Ledig",
  [ApiMaritalStatus.Married]: "Verheiratet",
  [ApiMaritalStatus.Widowed]: "Verwitwet",
  [ApiMaritalStatus.Divorced]: "Geschieden",
  [ApiMaritalStatus.NoSelection]: "Keine Auswahl",
};

export const CURRENT_MEDICAL_CONDITION_VALUES: EnumMap<ApiCurrentMedicalCondition> =
  {
    [ApiCurrentMedicalCondition.Attacks]: "Anfälle",
    [ApiCurrentMedicalCondition.LackOfAppetite]: "Appetitlosigkeit",
    [ApiCurrentMedicalCondition.ShortnessOfBreath]: "Atemnot",
    [ApiCurrentMedicalCondition.JointTrouble]: "Gelenkbeschwerden",
    [ApiCurrentMedicalCondition.EarNoseThroat]: "Hals / Nase / Ohren",
    [ApiCurrentMedicalCondition.HeartTrouble]: "Herzbeschwerden",
    [ApiCurrentMedicalCondition.Cough]: "Husten",
    [ApiCurrentMedicalCondition.Headache]: "Kopfschmerzen",
    [ApiCurrentMedicalCondition.NightSweats]: "Nachtschweiß",
    [ApiCurrentMedicalCondition.NervousTrouble]: "Nervöse Beschwerden",
    [ApiCurrentMedicalCondition.PainfulUrination]: "Schmerzhaftes Wasserlassen",
    [ApiCurrentMedicalCondition.ImpairedVisionEyeTrouble]:
      "Sehstörungen / Augenbeschwerden",
    [ApiCurrentMedicalCondition.MoodAndMotivationSwings]:
      "Stimmungs- und Antriebsschwankungen",
    [ApiCurrentMedicalCondition.WeightLossOrGain]: "Gewichtsabnahme / -zunahme",
    [ApiCurrentMedicalCondition.RheumaticDisorders]: "Rheumatische Beschwerden",
    [ApiCurrentMedicalCondition.BackPain]: "Rückenschmerzen",
    [ApiCurrentMedicalCondition.Pain]: "Schmerzen",
    [ApiCurrentMedicalCondition.HearingLoss]: "Schwerhörigkeit",
    [ApiCurrentMedicalCondition.Insomnia]: "Schlafstörungen",
    [ApiCurrentMedicalCondition.Vertigo]: "Schwindel",
    [ApiCurrentMedicalCondition.Addiction]:
      "Suchtkrankheiten / ehemalige Suchtkrankheiten",
    [ApiCurrentMedicalCondition.Indigestion]: "Verdauungsbeschwerden",
    [ApiCurrentMedicalCondition.Trembling]: "Zittern",
    [ApiCurrentMedicalCondition.Other]:
      "Sonstiges (Konkretisieren in “Nähere Angaben”)",
    [ApiCurrentMedicalCondition.NoSelection]: "Keine Auswahl",
  };
export const OPTICAL_AID_VALUES: EnumMap<ApiOpticalAidAnswer> = {
  [ApiOpticalAidAnswer.YesGlasses]: "Ja, Brille",
  [ApiOpticalAidAnswer.YesContactLenses]: "Ja, Kontaktlinsen",
  [ApiOpticalAidAnswer.No]: "Nein",
};
export const ADDICTION_VALUES: EnumMap<ApiAddiction> = {
  [ApiAddiction.Alcohol]: "Alkohol",
  [ApiAddiction.Cannabis]: "Cannabis",
  [ApiAddiction.Nicotine]: "Nikotine",
  [ApiAddiction.IllegalDrugs]: "Illegale Drogen",
};
export const BOOLEAN_WITH_UNKNOWN_VALUES: EnumMap<ApiYesNoDontKnowAnswer> = {
  [ApiYesNoDontKnowAnswer.Yes]: "Ja",
  [ApiYesNoDontKnowAnswer.No]: "Nein",
  [ApiYesNoDontKnowAnswer.DontKnow]: "Weiß ich nicht",
};
export const EATING_DISORDER_VALUES: EnumMap<ApiEatingDisorder> = {
  [ApiEatingDisorder.AnorexieNervosa]: "Anorexie Nervosa (Magersucht)",
  [ApiEatingDisorder.BulimieNervosa]: "Bulimie Nervosa (Ess-Brech-Sucht)",
};
export const HEART_DISEASE_VALUES: EnumMap<ApiHeartDisease> = {
  [ApiHeartDisease.HypertensionHypotension]:
    "Hypertonie / Hypotonie (hoher / niedriger Blutdruck)",
  [ApiHeartDisease.CardiacArrhythmia]:
    "Herzrythmusstörungen: Bradycardie / Tachykardie (langsamer / schneller Herzschlag)",
  [ApiHeartDisease.CoronaryHeartDisease]: "Koronare Herzkrankheit (KHK)",
  [ApiHeartDisease.HeartAttack]: "Herzinfarkt",
  [ApiHeartDisease.Stroke]: "Schlaganfall",
};
export const MENTAL_ILLNESS_VALUES: EnumMap<ApiMentalIllness> = {
  [ApiMentalIllness.Depression]: "Depression",
  [ApiMentalIllness.AnxietyDisorder]: "Angststörung",
  [ApiMentalIllness.SomatizationDisorder]: "Somatisierungsstörung",
  [ApiMentalIllness.Borderline]: "Borderline",
  [ApiMentalIllness.BipolarDisorder]: "Bipolare Störung",
  [ApiMentalIllness.Psychosis]: "Psychose",
  [ApiMentalIllness.ObsessiveCompulsiveDisorder]: "Zwangsstörung",
};
export const THYROID_DISEASE_VALUES: EnumMap<ApiThyroidDisease> = {
  [ApiThyroidDisease.Hypothyreosis]: "Hypothyreose (Schilddrüsenunterfunktion)",
  [ApiThyroidDisease.Nodule]: "Knoten (kalt, warm, heiß)",
  [ApiThyroidDisease.Hyperthyreoisis]:
    "Hyperthyreose (Schilddrüsenüberfunktion)",
  [ApiThyroidDisease.HashimotoThyreoiditis]: "Hashimoto-Thyreoiditis",
};
