/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { format } from "date-fns";
import { isArray, isDate, isDeepEqual } from "remeda";

import {
  EyeExaminationInfoOther,
  HearingExaminationInfoOther,
  MeaslesContraIndication,
  MeaslesProtectionComplete,
  SchoolInfoLetter,
  SchoolInfoLetterExaminationType,
  SchoolInfoLetterPhysiciansRecommendation,
  SchoolInfoLetterSchoolAndPromotionHints,
  SchoolInfoLetterTherapyAndPromotionInfo,
} from "@/lib/businessModules/schoolEntry/api/models/SchoolInfoLetter";

export const schoolInfoLetterExaminationTypeEnum: Record<
  SchoolInfoLetterExaminationType,
  string
> = {
  REGULAR_EXAMINATION: "Regelkind",
  CAN_CHILD: "Kann-Kind",
  ENTRY_LEVEL: "Eingangsstufe",
};

export const schoolAndPromotionHintsEnum: Record<
  keyof SchoolInfoLetterSchoolAndPromotionHints,
  string
> = {
  behavior: "Verhalten",
  articulation: "Artikulation",
  grammarAndVocabulary: "Grammatik / Wortschatz",
  language: "Sprache",
  visualPerception: "Visuelle Wahrnehmung",
  colorsShapesNumbersSets: "Farben / Formen / Zahlen / Mengen",
  auditiveInformationProcessing: "Auditive Informationsverarbeitung",
  grossMotorSkillsOrPhysicalCoordination: "Grobmotorik / Körperkoordination",
  leftHandedness: "Linkshändigkeit",
  fineOrVisuoMotorSkills: "Feinmotorik / Visuomotorik",
};

export function mapMeaslesProtectionComplete(value: MeaslesProtectionComplete) {
  switch (value) {
    case "yes":
      return "Masernschutz vollständig";
    case "no":
      return "Masernschutz unvollständig";
    case "undefined":
      return "Unbekannt";
  }
}

export function mapMeaslesContraIndication(
  value: MeaslesContraIndication,
  date?: Date | "",
): string {
  switch (value) {
    case "NONE":
      return "nicht vorhanden";
    case "PERMANENT":
      return "ständig";
    case "TEMPORARY":
      return isDate(date) ? `Bis zum ${format(date, "dd.MM.yyyy")}` : "Bis zum";
  }
}

export const eyeExaminationInfoOtherEnum: Record<
  keyof EyeExaminationInfoOther,
  string
> = {
  clarificationArranged: "Abklärung veranlasst",
  spectacleWearer: "Brillenträger",
  underTreatment: "in Kontrolle / Behandlung",
  colorSenseDisorder: "Farbsinnstörung",
};

export const hearingExaminationInfoOtherEnum: Record<
  keyof HearingExaminationInfoOther,
  string
> = {
  clarificationArranged: "Abklärung veranlasst",
  underTreatment: "in Kontrolle / Behandlung",
};

export const therapyAndPromotionInfoEnum: Record<
  keyof SchoolInfoLetterTherapyAndPromotionInfo,
  string
> = {
  speechTherapy: "Logopädie",
  ergoTherapy: "Ergotherapie",
  physioTherapy: "Krankengymnastik",
  psychoMotorSkills: "Psychomotorik",
  miscellaneous: "sonstiges",
};

export const physiciansRecommendationEnum: Record<
  keyof SchoolInfoLetterPhysiciansRecommendation,
  string
> = {
  concernsCanChild:
    "Prüfung einer Zurückstellung durch Schulleitung / Bedenken Kann-Kind",
  specialPromotion:
    "Besondere schulische Förderung / Entwicklungsbeobachtung / Einleitung vorbeugender Maßnahmen",
  introductionInBFZ: "Vorstellung im BFZ",
  promotionOutsideSchool: "Außerschulische Förderung",
  furtherMeasures: "Weitere Maßnahmen",
  meetingBetweenYouthHealthServicesAndSchoolManagementRecommended:
    "Besprechung Kinder- und Jugendgesundheitsdienst mit Schulleitung",
};

export function booleanValue(value: "yes" | "no") {
  return value === "yes" ? "ja" : "nein";
}

export function isFieldDirty(
  defaultValue: SchoolInfoLetter[keyof SchoolInfoLetter],
  currentValue: SchoolInfoLetter[keyof SchoolInfoLetter],
) {
  if (isArray(defaultValue) && isArray(currentValue)) {
    return !isDeepEqual(new Set(defaultValue), new Set(currentValue));
  }
  return !isDeepEqual(defaultValue, currentValue);
}
