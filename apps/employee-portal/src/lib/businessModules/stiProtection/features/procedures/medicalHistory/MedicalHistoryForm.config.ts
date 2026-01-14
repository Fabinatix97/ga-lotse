/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MonthAndYear, YesOrNoFieldData } from "@eshg/lib-portal";
import {
  ApiExamination,
  ApiGender,
  ApiPartnerRiskFactors,
  ApiPreviousIllness,
  ApiProtectionMethod,
  ApiRelationshipModel,
  ApiSafeSexPractice,
  ApiSexWorkLocation,
  ApiSexualOrientation,
  ApiVaccination,
} from "@eshg/sti-protection-api";

type ValueOf<T> = T[keyof T];
type DateKeys<T> = ValueOf<{
  [K in keyof T]-?: K extends `${infer J}Date` ? J : K;
}>;

export type ExaminationData = Required<
  Record<DateKeys<ApiExamination>, StandardExaminationQuestion>
>;

export interface StandardRiskFactors {
  unprotectedVaginal: StandardRiskQuestion;
  unprotectedAnal: StandardRiskQuestion;
  unprotectedOral: StandardRiskQuestion;
}
export interface StandardRiskQuestion {
  taken: YesOrNoFieldData;
  lastIncident: MonthAndYear;
}
export interface StandardExaminationQuestion {
  hadExamination: YesOrNoFieldData;
  examinationDate: MonthAndYear;
}
const defaultStandardExaminationQuestion: StandardExaminationQuestion = {
  hadExamination: null,
  examinationDate: { year: "", month: null },
};
export const defaultExaminations: ExaminationData = {
  hepA: defaultStandardExaminationQuestion,
  hepB: defaultStandardExaminationQuestion,
  hepC: defaultStandardExaminationQuestion,
  hiv: defaultStandardExaminationQuestion,
  syphilis: defaultStandardExaminationQuestion,
  gonorrhea: defaultStandardExaminationQuestion,
  chlamydia: defaultStandardExaminationQuestion,
} as const;

export type PreviousIllnessesForm = {
  [K in keyof ApiPreviousIllness]-?: Exclude<
    ApiPreviousIllness[K],
    undefined
  > extends boolean
    ? YesOrNoFieldData
    : Exclude<ApiPreviousIllness[K], undefined>;
};

export const defaultPreviousIllnesses: PreviousIllnessesForm = {
  hepA: null,
  hepB: null,
  hepC: null,
  hiv: null,
  syphilis: null,
  gonorrhea: null,
  chlamydia: null,
  other: null,
  otherData: "",
};
const defaultMonthAndYear: MonthAndYear = { month: null, year: "" };
const defaultStandardRiskQuestion: StandardRiskQuestion = {
  lastIncident: defaultMonthAndYear,
  taken: null,
};
const defaultStandardRisks: StandardRiskFactors = {
  unprotectedVaginal: defaultStandardRiskQuestion,
  unprotectedAnal: defaultStandardRiskQuestion,
  unprotectedOral: defaultStandardRiskQuestion,
};

const defaultVaccinations: VaccinationData = [];

export interface MedicalHistoryFormData {
  general: GeneralData;

  examinations: ExaminationData;

  previousIllnesses: PreviousIllnessesForm;

  sexualOrientationAndContact: SexualOrientationAndContactData;

  prevention: PreventionData;

  standardRiskFactors: StandardRiskFactors;
  otherRisks: {
    taken: YesOrNoFieldData;
    description: string;
  };

  remarks: string;
}

export interface GeneralData {
  examinationReason: string;
  relationshipModel: ApiRelationshipModel | "";
  contactToClarifyDate: string;
  currentSymptoms: string;
  lastCancerScreening: string;
  lastMenstruation: string;
  hasBeenPregnant: YesOrNoFieldData;
  knownOperationsOrIllnesses: string;
  medications: string;
  numberOfBirthsOrAbortions: number | "";
  numberOfPregnancies: number | "";
}

type VaccinationData = ApiVaccination[];

export interface PreventionData {
  vaccinations: VaccinationData;
  safeSexRegularity: ApiSafeSexPractice | "";
  stiProtectiveMeasures: ApiProtectionMethod[];
  infoAboutPrepDesired: YesOrNoFieldData;
}

export interface SexualOrientationAndContactData {
  sexualOrientation: ApiSexualOrientation | null;
  numberOfSexualPartnersLast12Months: number | "";
  sexualContactGenders: ApiGender[];
  sexualContactFactors: ApiPartnerRiskFactors[];
  startInSexWork: MonthAndYear;
  sexWorkType: ApiSexWorkLocation[];
}

export function defaultMedicalHistoryFormValues(): MedicalHistoryFormData {
  return {
    general: {
      contactToClarifyDate: "",
      currentSymptoms: "",
      examinationReason: "",
      hasBeenPregnant: null,
      knownOperationsOrIllnesses: "",
      lastCancerScreening: "",
      lastMenstruation: "",
      medications: "",
      numberOfBirthsOrAbortions: "",
      numberOfPregnancies: "",
      relationshipModel: "",
    },
    examinations: defaultExaminations,
    previousIllnesses: defaultPreviousIllnesses,

    sexualOrientationAndContact: {
      numberOfSexualPartnersLast12Months: "",
      sexualContactGenders: [],
      sexualContactFactors: [],
      startInSexWork: { month: null, year: "" },
      sexWorkType: [],
      sexualOrientation: null,
    },

    prevention: {
      vaccinations: defaultVaccinations,
      safeSexRegularity: "",
      stiProtectiveMeasures: [],
      infoAboutPrepDesired: null,
    },

    standardRiskFactors: defaultStandardRisks,
    otherRisks: { taken: null, description: "" },

    remarks: "",
  };
}
