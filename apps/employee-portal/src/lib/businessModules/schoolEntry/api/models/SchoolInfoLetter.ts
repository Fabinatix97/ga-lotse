/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDate, isDefined } from "remeda";

import {
  ApiSaveSchoolInfoLetterRequest,
  ApiSchoolInfoLetterChild,
  ApiSchoolInfoLetterExamination,
  ApiSchoolInfoLetterExaminationType,
  ApiSchoolInfoLetterEyeExaminationInfo,
  ApiSchoolInfoLetterHearingExaminationInfo,
  ApiSchoolInfoLetterPhysiciansRecommendation,
  ApiSchoolInfoLetterSchoolAndPromotionHints,
  ApiSchoolInfoLetterTherapyAndPromotionInfo,
  ApiSchoolInfoLetterVaccinationInfo,
} from "@eshg/school-entry-api";

export type SchoolInfoLetterExaminationType =
  ApiSchoolInfoLetterExaminationType;
export const SchoolInfoLetterExaminationType =
  ApiSchoolInfoLetterExaminationType;

export type SchoolInfoLetterPhysiciansRecommendation =
  ApiSchoolInfoLetterPhysiciansRecommendation;

export type SchoolInfoLetterSchoolAndPromotionHints =
  ApiSchoolInfoLetterSchoolAndPromotionHints;

export type SchoolInfoLetterTherapyAndPromotionInfo =
  ApiSchoolInfoLetterTherapyAndPromotionInfo;

export type EyeExaminationInfoOther = Omit<
  ApiSchoolInfoLetterEyeExaminationInfo,
  "conspicuous"
>;

export type HearingExaminationInfoOther = Omit<
  ApiSchoolInfoLetterHearingExaminationInfo,
  "conspicuous"
>;

type BooleanRadioValue = "yes" | "no";
export type MeaslesProtectionComplete = BooleanRadioValue | "undefined";

export type MeaslesContraIndication = "NONE" | "PERMANENT" | "TEMPORARY";
export interface SchoolInfoLetter {
  child: ApiSchoolInfoLetterChild;
  consultationWithCustodianRecommended: boolean;
  customRecommendation: string;
  date: string;
  eyeExaminationInfoConspicuous: BooleanRadioValue;
  eyeExaminationInfoOther: (keyof EyeExaminationInfoOther)[];
  hearingExaminationInfoConspicuous: BooleanRadioValue;
  hearingExaminationInfoOther: (keyof HearingExaminationInfoOther)[];
  note: string;
  parentsWishNote: string;
  referredToFurtherConsultationFromSchool: boolean;
  physiciansRecommendation: (keyof ApiSchoolInfoLetterPhysiciansRecommendation)[];
  postponed: boolean;
  schoolAndPromotionHints: (keyof ApiSchoolInfoLetterSchoolAndPromotionHints)[];
  schoolYear: string;
  therapyAndPromotionInfo: (keyof ApiSchoolInfoLetterTherapyAndPromotionInfo)[];
  type: SchoolInfoLetterExaminationType;
  measlesProtectionComplete: MeaslesProtectionComplete;
  vaccinationPassNotPresented: boolean;
  measlesContraIndication: MeaslesContraIndication;
  measlesContraIndicationUntil: Date | "";
}

// TODO: clean up code when the fields in backend are no longer optional ISSUE-8917
export const emptySchoolInfoLetter: SchoolInfoLetter = {
  child: {
    dateOfBirth: "",
    name: "",
  },
  consultationWithCustodianRecommended: false,
  customRecommendation: "",
  date: "",
  eyeExaminationInfoConspicuous: "no",
  eyeExaminationInfoOther: [],
  hearingExaminationInfoConspicuous: "no",
  hearingExaminationInfoOther: [],
  note: "",
  parentsWishNote: "",
  referredToFurtherConsultationFromSchool: false,
  physiciansRecommendation: [],
  postponed: false,
  schoolAndPromotionHints: [],
  schoolYear: "",
  therapyAndPromotionInfo: [],
  measlesProtectionComplete: "undefined",
  vaccinationPassNotPresented: false,
  measlesContraIndication: "NONE",
  measlesContraIndicationUntil: "",
  type: "REGULAR_EXAMINATION",
};

export function mapSchoolInfoLetter(
  response: ApiSchoolInfoLetterExamination,
): SchoolInfoLetter {
  const { conspicuous: eyeConspicuous, ...eyeExaminationInfo } =
    response?.eyeExaminationInfo ?? { conspicuous: false };
  const { conspicuous: hearingConspicuous, ...hearingExaminationInfo } =
    response?.hearingExaminationInfo ?? { conspicuous: false };

  return {
    child: response.child,
    consultationWithCustodianRecommended:
      response.consultationWithCustodianRecommended,
    customRecommendation: response.customRecommendation ?? "",
    date: response.date,
    eyeExaminationInfoConspicuous: eyeConspicuous ? "yes" : "no",
    eyeExaminationInfoOther: mapObjectToSelected(eyeExaminationInfo),
    hearingExaminationInfoConspicuous: hearingConspicuous ? "yes" : "no",
    hearingExaminationInfoOther: mapObjectToSelected(hearingExaminationInfo),
    note: response.note ?? "",
    parentsWishNote: response.parentsWish?.note ?? "",
    referredToFurtherConsultationFromSchool:
      response.parentsWish?.referredToFurtherConsultationFromSchool ?? false,
    physiciansRecommendation: mapObjectToSelected(
      response.physiciansRecommendation,
    ),
    postponed: response.postponed,
    schoolAndPromotionHints: mapObjectToSelected(
      response.schoolAndPromotionHints,
    ),
    schoolYear: response.schoolYear,
    therapyAndPromotionInfo: mapObjectToSelected(
      response.therapyAndPromotionInfo,
    ),
    type: response.type,
    measlesProtectionComplete: isDefined(
      response.vaccinationInfo?.measlesProtectionComplete,
    )
      ? response.vaccinationInfo.measlesProtectionComplete
        ? "yes"
        : "no"
      : "undefined",
    vaccinationPassNotPresented:
      response.vaccinationInfo?.vaccinationPassNotPresented ?? false,
    measlesContraIndication: mapMeaslesContraIndication(
      response.vaccinationInfo,
    ),
    measlesContraIndicationUntil:
      response.vaccinationInfo?.measlesContraIndicationUntil ?? "",
  };
}

export function mapMeaslesContraIndication(
  response?: ApiSchoolInfoLetterVaccinationInfo,
): SchoolInfoLetter["measlesContraIndication"] {
  if (
    response?.measlesContraIndication &&
    isDefined(response.measlesContraIndicationDuration)
  ) {
    return response.measlesContraIndicationDuration;
  }
  return "NONE";
}

export function mapObjectToSelected<T extends object>(
  response?: T,
): (keyof T)[] {
  return isDefined(response)
    ? (Object.keys(response) as (keyof T)[]).filter(
        (key) => response[key] === true,
      )
    : [];
}

export function isInSelectedList<T>(
  selected: (keyof T)[],
  objectKey: keyof T,
): boolean {
  return selected.includes(objectKey);
}

export function mapSchoolInfoLetterToApiRequest(
  values: SchoolInfoLetter,
): ApiSaveSchoolInfoLetterRequest {
  return {
    consultationWithCustodianRecommended:
      values.consultationWithCustodianRecommended,
    customRecommendation: values.customRecommendation,
    eyeExaminationInfo: {
      clarificationArranged: isInSelectedList(
        values.eyeExaminationInfoOther,
        "clarificationArranged",
      ),
      colorSenseDisorder: isInSelectedList(
        values.eyeExaminationInfoOther,
        "colorSenseDisorder",
      ),
      conspicuous: values.eyeExaminationInfoConspicuous === "yes",
      spectacleWearer: isInSelectedList(
        values.eyeExaminationInfoOther,
        "spectacleWearer",
      ),
      underTreatment: isInSelectedList(
        values.eyeExaminationInfoOther,
        "underTreatment",
      ),
    },
    hearingExaminationInfo: {
      clarificationArranged: isInSelectedList(
        values.hearingExaminationInfoOther,
        "clarificationArranged",
      ),
      conspicuous: values.hearingExaminationInfoConspicuous === "yes",
      underTreatment: isInSelectedList(
        values.eyeExaminationInfoOther,
        "underTreatment",
      ),
    },
    note: values.note,
    parentsWish: {
      note: values.parentsWishNote,
      referredToFurtherConsultationFromSchool:
        values.referredToFurtherConsultationFromSchool,
    },
    physiciansRecommendation: {
      concernsCanChild: isInSelectedList(
        values.physiciansRecommendation,
        "concernsCanChild",
      ),
      furtherMeasures: isInSelectedList(
        values.physiciansRecommendation,
        "furtherMeasures",
      ),
      introductionInBFZ: isInSelectedList(
        values.physiciansRecommendation,
        "introductionInBFZ",
      ),
      meetingBetweenYouthHealthServicesAndSchoolManagementRecommended:
        isInSelectedList(
          values.physiciansRecommendation,
          "meetingBetweenYouthHealthServicesAndSchoolManagementRecommended",
        ),
      promotionOutsideSchool: isInSelectedList(
        values.physiciansRecommendation,
        "promotionOutsideSchool",
      ),
      specialPromotion: isInSelectedList(
        values.physiciansRecommendation,
        "specialPromotion",
      ),
    },
    postponed: values.postponed,
    schoolAndPromotionHints: {
      articulation: isInSelectedList(
        values.schoolAndPromotionHints,
        "articulation",
      ),
      auditiveInformationProcessing: isInSelectedList(
        values.schoolAndPromotionHints,
        "auditiveInformationProcessing",
      ),
      behavior: isInSelectedList(values.schoolAndPromotionHints, "behavior"),
      colorsShapesNumbersSets: isInSelectedList(
        values.schoolAndPromotionHints,
        "colorsShapesNumbersSets",
      ),
      fineOrVisuoMotorSkills: isInSelectedList(
        values.schoolAndPromotionHints,
        "fineOrVisuoMotorSkills",
      ),
      grammarAndVocabulary: isInSelectedList(
        values.schoolAndPromotionHints,
        "grammarAndVocabulary",
      ),
      grossMotorSkillsOrPhysicalCoordination: isInSelectedList(
        values.schoolAndPromotionHints,
        "grossMotorSkillsOrPhysicalCoordination",
      ),
      language: isInSelectedList(values.schoolAndPromotionHints, "language"),
      leftHandedness: isInSelectedList(
        values.schoolAndPromotionHints,
        "leftHandedness",
      ),
      visualPerception: isInSelectedList(
        values.schoolAndPromotionHints,
        "visualPerception",
      ),
    },
    therapyAndPromotionInfo: {
      ergoTherapy: isInSelectedList(
        values.therapyAndPromotionInfo,
        "ergoTherapy",
      ),
      miscellaneous: isInSelectedList(
        values.therapyAndPromotionInfo,
        "miscellaneous",
      ),
      physioTherapy: isInSelectedList(
        values.therapyAndPromotionInfo,
        "physioTherapy",
      ),
      psychoMotorSkills: isInSelectedList(
        values.therapyAndPromotionInfo,
        "psychoMotorSkills",
      ),
      speechTherapy: isInSelectedList(
        values.therapyAndPromotionInfo,
        "speechTherapy",
      ),
    },
    type: values.type,
    vaccinationInfo: {
      measlesContraIndication: values.measlesContraIndication !== "NONE",
      measlesContraIndicationDuration:
        values.measlesContraIndication === "NONE"
          ? undefined
          : values.measlesContraIndication,
      measlesContraIndicationUntil: isDate(values.measlesContraIndicationUntil)
        ? values.measlesContraIndicationUntil
        : undefined,
      measlesProtectionComplete:
        values.measlesProtectionComplete === "yes"
          ? true
          : values.measlesProtectionComplete === "no"
            ? false
            : undefined,
      vaccinationPassNotPresented: values.vaccinationPassNotPresented,
    },
  };
}
