/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiConcern,
  ApiCreateMedicalHistoryRequest,
  ApiExamination,
  ApiGender,
  ApiPreviousIllness,
  ApiRelationshipModel,
  ApiRiskFactors,
  ApiSexualOrientation,
  ApiStiProtectionProcedure,
  ApiVaccination,
  CreateMedicalHistoryRequest,
} from "@eshg/employee-portal-api/stiProtection";
import { MonthAndYear } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export type ExaminationData = Merge<
  ApiExamination,
  {
    [K in keyof ApiExamination]: {
      hadExamination: boolean;
      examinationDate: MonthAndYear;
    };
  }
>;

export type VaccinationData = Merge<
  ApiVaccination,
  {
    [K in keyof ApiVaccination]: {
      hadVaccination: boolean;
      vaccinationDate: MonthAndYear;
    };
  }
>;

type RiskFactors = Merge<
  ApiRiskFactors,
  {
    vaccinations: VaccinationData;
  }
>;

export const defaultExaminations: ExaminationData = {
  chlamydia: {
    hadExamination: false,
    examinationDate: { month: null, year: "" },
  },
  gonorrhea: {
    hadExamination: false,
    examinationDate: { month: null, year: "" },
  },
  hepA: { hadExamination: false, examinationDate: { month: null, year: "" } },
  hepB: { hadExamination: false, examinationDate: { month: null, year: "" } },
  hepC: { hadExamination: false, examinationDate: { month: null, year: "" } },
  hiv: { hadExamination: false, examinationDate: { month: null, year: "" } },
  syphilis: {
    hadExamination: false,
    examinationDate: { month: null, year: "" },
  },
};

export const defaultPreviousIllnesses: ApiPreviousIllness = {
  chlamydia: false,
  gonorrhea: false,
  hepA: false,
  hepB: false,
  hepC: false,
  hiv: false,
  syphilis: false,
};

export const defaultVaccinations: VaccinationData = {
  hepA: { hadVaccination: false, vaccinationDate: { month: null, year: "" } },
  hepB: { hadVaccination: false, vaccinationDate: { month: null, year: "" } },
  hpv: { hadVaccination: false, vaccinationDate: { month: null, year: "" } },
};

export interface MedicalHistoryFormData
  extends Omit<
    CreateMedicalHistoryRequest["apiCreateMedicalHistoryRequest"]["medicalHistory"],
    | "contactToClarifyDuration"
    | "examinations"
    | "riskFactors"
    | "relationshipModel"
  > {
  contactToClarifyDuration: OptionalFieldValue<string>;
  currentSymptoms: string;
  examinations: ExaminationData;
  lastCancerScreening: OptionalFieldValue<string>;
  lastMenstruation: OptionalFieldValue<string>;
  hasBeenPregnant: boolean | null;
  knownOperationsOrIllnesses: string;
  medications: string;
  numberOfBirthsOrAbortions: number;
  numberOfPregnancies: number;
  numberOfSexualPartnersLast12Months: number;
  relationshipModel: OptionalFieldValue<ApiRelationshipModel>;
  remarks: string;
  riskFactors: RiskFactors;
  sexualContact: ApiGender;
  sexualOrientation: ApiSexualOrientation;
}

type MedicalHistoryType =
  ApiCreateMedicalHistoryRequest["medicalHistory"]["type"];

export const medicalHistoryTypeByConcern: Record<
  ApiConcern,
  MedicalHistoryType
> = {
  [ApiConcern.SexWork]: "SexWorkMedicalHistory",
  [ApiConcern.HivStiConsultation]: "StiConsultationMedicalHistory",
} satisfies Record<ApiConcern, MedicalHistoryType>;

export function defaultMedicalHistoryFormValues({
  concern,
}: ApiStiProtectionProcedure): MedicalHistoryFormData {
  return {
    type: medicalHistoryTypeByConcern[concern],
    contactToClarifyDuration: "",
    currentSymptoms: "",
    examinationReason: "",
    examinations: defaultExaminations,
    hasBeenPregnant: null,
    knownOperationsOrIllnesses: "",
    lastCancerScreening: "",
    lastMenstruation: "",
    medications: "",
    numberOfBirthsOrAbortions: 0,
    numberOfPregnancies: 0,
    numberOfSexualPartnersLast12Months: 0,
    previousIllnesses: defaultPreviousIllnesses,
    relationshipModel: "",
    remarks: "",
    riskFactors: {
      prepInfoProvided: false,
      vaccinations: defaultVaccinations,
    },
    sexualContact: "NOT_SPECIFIED",
    sexualOrientation: "NOT_SPECIFIED",
  };
}

export const medicalHistoryFormFields = {
  additionalComments: "",
  contactToClarifyDuration: "Abzuklärender Kontakt vor",
  currentSymptoms: "Aktuelle Beschwerden",
  examinationReason: "Grund für die heutige Beratung",
  hasBeenPregnant: "Bereits schwanger?",
  knownOperationsOrIllnesses: "Bekannte Operationen oder Erkrankungen",
  lastCancerScreening: "Letzte Krebsvorsorge vor",
  lastMenstruation: "Letzte Menstruation vor",
  medications: "Medikamente",
  numberOfBirthsOrAbortions: "Anzahl Geburten/Aborte",
  numberOfPregnancies: "Wenn ja, wie oft?",
  numberOfSexualPartnersLast12Months:
    "Anzahl der Sexpartner:innen in den letzten 12 Monaten",
  previousIllnesses: "Bisherige Krankheiten",
  relationshipModel: "Beziehungsmodell",
  remarks: "Bemerkungen",
  riskContacts: "",
  sexualContact: "Sexueller Kontakt",
  sexualOrientation: "Sexuelle Orientierung",
} as const satisfies Record<
  keyof Omit<MedicalHistoryFormData, "type" | "examinations" | "riskFactors">,
  string
>;

export const medicalHistoryFormSections = {
  common: "Allgemein",
  examinations: "Untersuchungen",
  previousIllnesses: "Bisherige Krankheiten",
  riskAndPrevention: "Risiko und Prävention",
  sexualOrientationAndContact: "Sexuelle Orientierung / Kontakte",
  vaccinations: "Impfungen",
};
