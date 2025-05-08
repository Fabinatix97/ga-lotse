/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MonthAndYear } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { YesOrNoFieldData } from "@eshg/lib-portal/components/formFields/YesOrNoWithFollowUp";
import {
  ApiConcern,
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

import {
  StandardExaminationQuestion,
  StandardRiskFactors,
  StandardRiskQuestion,
} from "./Steps/options";

type ValueOf<T> = T[keyof T];
type DateKeys<T> = ValueOf<{
  [K in keyof T]-?: K extends `${infer J}Date` ? J : K;
}>;

const defaultStandardExaminationQuestion: StandardExaminationQuestion = {
  hadExamination: null,
  examinationDate: { year: "", month: null },
};

export type ExaminationData = Required<
  Record<DateKeys<ApiExamination>, StandardExaminationQuestion>
>;

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

export interface AnamnesisFormData {
  concern: ApiConcern;
  procedureId?: string;
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

export type FormDataWithoutConcern = Omit<AnamnesisFormData, "concern">;

export function defaultAnamnesisFormValues(): FormDataWithoutConcern {
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
