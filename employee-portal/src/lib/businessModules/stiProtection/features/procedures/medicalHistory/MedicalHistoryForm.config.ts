/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCreateMedicalHistoryRequest,
  ApiExamination,
  ApiVaccination,
} from "@eshg/employee-portal-api/stiProtection";
import { MonthAndYear } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";

interface ExaminationData extends Omit<ApiExamination, "examinationDate"> {
  examinationDate: MonthAndYear;
  hadExamination: boolean | null;
}

interface VaccinationData extends Omit<ApiVaccination, "vaccinationDate"> {
  vaccinationDate: MonthAndYear;
  hadVaccination: boolean | null;
}

export interface MedicalHistoryFormData
  extends Omit<
    ApiCreateMedicalHistoryRequest["medicalHistory"],
    "examinations" | "vaccinations"
  > {
  examinations: ExaminationData[];
  vaccinations: VaccinationData[];
  lastMenstruation: OptionalFieldValue<string>;
  lastCancerScreening: OptionalFieldValue<string>;
  hasBeenPregnant: boolean | null;
  numberOfSexualPartners: number;
  numberOfPregnancies: number;
  numberOfBirthsOrAbortions: number;
}

export const initialValues: MedicalHistoryFormData = {
  type: "SexWorkMedicalHistory",
  examinationReason: "",
  sexualContact: "NOT_SPECIFIED",
  sexualOrientation: "NOT_SPECIFIED",
  examinations: [
    {
      hadExamination: null,
      diseaseType: "HEPATITIS_A",
      examinationDate: { month: null, year: "" },
    },
    {
      hadExamination: null,
      diseaseType: "HEPATITIS_B",
      examinationDate: { month: null, year: "" },
    },
    {
      hadExamination: null,
      diseaseType: "HEPATITIS_C",
      examinationDate: { month: null, year: "" },
    },
    {
      hadExamination: null,
      diseaseType: "HIV",
      examinationDate: { month: null, year: "" },
    },
    {
      hadExamination: null,
      diseaseType: "SYPHILIS",
      examinationDate: { month: null, year: "" },
    },
    {
      hadExamination: null,
      diseaseType: "GONORRHEA",
      examinationDate: { month: null, year: "" },
    },
    {
      hadExamination: null,
      diseaseType: "CHLAMYDIA",
      examinationDate: { month: null, year: "" },
    },
  ],
  vaccinations: [
    {
      hadVaccination: null,
      diseaseType: "HEPATITIS_A",
      vaccinationDate: { month: null, year: "" },
    },
    {
      hadVaccination: null,
      diseaseType: "HEPATITIS_B",
      vaccinationDate: { month: null, year: "" },
    },
  ],
  hasBeenPregnant: null,
  lastMenstruation: "",
  lastCancerScreening: "",
  numberOfSexualPartners: 0,
  numberOfPregnancies: 0,
  numberOfBirthsOrAbortions: 0,
};
