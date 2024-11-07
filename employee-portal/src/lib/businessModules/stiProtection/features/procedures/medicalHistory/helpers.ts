/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiExamination,
  ApiGetMedicalHistory200Response,
  ApiVaccination,
} from "@eshg/employee-portal-api/stiProtection";

import {
  ExaminationData,
  MedicalHistoryFormData,
  VaccinationData,
  defaultExaminations,
  defaultPreviousIllnesses,
  defaultVaccinations,
} from "./MedicalHistoryForm.config";

function mapApiExaminationToForm(
  examinations?: ApiExamination,
): ExaminationData {
  const examinationData: ExaminationData = { ...defaultExaminations };

  if (examinations) {
    for (const exam of Object.keys(examinationData)) {
      const key = exam as keyof ApiExamination;
      const examinationDate = examinations[key];

      if (examinationDate) {
        examinationData[key] = {
          hadExamination: true,
          examinationDate: {
            month: examinationDate.getMonth(),
            year: examinationDate.getFullYear(),
          },
        };
      }
    }
  }

  return examinationData;
}

function mapApiVaccinationToForm(
  vaccinations?: ApiVaccination,
): VaccinationData {
  const vaccinationData: VaccinationData = { ...defaultVaccinations };

  if (vaccinations) {
    for (const vax of Object.keys(vaccinationData)) {
      const key = vax as keyof ApiVaccination;
      const vaccinationDate = vaccinations[key];

      if (vaccinationDate) {
        vaccinationData[key] = {
          hadVaccination: true,
          vaccinationDate: {
            month: vaccinationDate.getMonth(),
            year: vaccinationDate.getFullYear(),
          },
        };
      }
    }
  }

  return vaccinationData;
}

export function mapToFormValues(
  apiMedicalHistory: ApiGetMedicalHistory200Response,
): MedicalHistoryFormData {
  return {
    type: apiMedicalHistory.type,
    contactToClarifyDuration: "",
    currentSymptoms: "",
    examinationReason: apiMedicalHistory.examinationReason,
    examinations: mapApiExaminationToForm(apiMedicalHistory.examinations),
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
    sexualContact: "NOT_SPECIFIED",
    sexualOrientation: "NOT_SPECIFIED",
    riskFactors: {
      prepInfoProvided: apiMedicalHistory.riskFactors.prepInfoProvided,
      vaccinations: mapApiVaccinationToForm(
        apiMedicalHistory.riskFactors.vaccinations,
      ),
    },
  };
}

export function firstDayOfCurrentMonth(): Date {
  const { getMonth, getFullYear } = new Date();

  return new Date(getFullYear(), getMonth(), 1);
}
