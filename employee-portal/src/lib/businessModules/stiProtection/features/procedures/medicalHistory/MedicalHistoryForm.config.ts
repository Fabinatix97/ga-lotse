/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiExamination,
  ApiGender,
  ApiRiskFactors,
  ApiSexualOrientation,
  ApiVaccination,
  CreateMedicalHistoryRequest,
} from "@eshg/employee-portal-api/stiProtection";
import { MonthAndYear } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

type ExaminationData = Merge<
  ApiExamination,
  {
    [K in keyof ApiExamination]: MonthAndYear;
  }
>;

export type VaccinationData = Merge<
  ApiVaccination,
  {
    [K in keyof ApiVaccination]: MonthAndYear;
  }
>;

type RiskFactors = Merge<
  ApiRiskFactors,
  {
    vaccinations: VaccinationData;
  }
>;

export interface MedicalHistoryFormData
  extends Omit<
    CreateMedicalHistoryRequest["apiCreateMedicalHistoryRequest"]["medicalHistory"],
    "examinations" | "riskFactors"
  > {
  examinations: ExaminationData;
  lastMenstruation: OptionalFieldValue<string>;
  lastCancerScreening: OptionalFieldValue<string>;
  hasBeenPregnant: boolean | null;
  numberOfSexualPartners: number;
  numberOfPregnancies: number;
  numberOfBirthsOrAbortions: number;
  sexualContact: ApiGender;
  sexualOrientation: ApiSexualOrientation;
  riskFactors: RiskFactors;
}

export const initialValues: MedicalHistoryFormData = {
  type: "SexWorkMedicalHistory",
  examinationReason: "",
  sexualContact: "NOT_SPECIFIED",
  sexualOrientation: "NOT_SPECIFIED",
  examinations: {
    chlamydia: { month: null, year: "" },
    gonorrhea: { month: null, year: "" },
    hepA: { month: null, year: "" },
    hepB: { month: null, year: "" },
    hepC: { month: null, year: "" },
    hiv: { month: null, year: "" },
    syphilis: { month: null, year: "" },
  },
  hasBeenPregnant: null,
  lastMenstruation: "",
  lastCancerScreening: "",
  numberOfSexualPartners: 0,
  numberOfPregnancies: 0,
  numberOfBirthsOrAbortions: 0,
  previousIllnesses: {
    chlamydia: false,
    gonorrhea: false,
    hepA: false,
    hepB: false,
    hepC: false,
    hiv: false,
    syphilis: false,
  },
  riskFactors: {
    prepInfoProvided: false,
    vaccinations: {
      hepA: { month: null, year: "" },
      hepB: { month: null, year: "" },
      hpv: { month: null, year: "" },
    },
  },
};
