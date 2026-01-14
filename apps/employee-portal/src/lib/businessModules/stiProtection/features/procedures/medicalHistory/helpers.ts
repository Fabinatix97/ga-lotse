/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MonthAndYear,
  mapBoolToYesOrNo,
  mapMonthAndYear,
  mapOptionalValue,
  mapYesOrNoToBool,
} from "@eshg/lib-portal";
import {
  ApiCreateMedicalHistoryRequest,
  ApiExamination,
  ApiGetMedicalHistory200Response,
  ApiPrevention,
  ApiPreviousIllness,
  ApiRiskContact,
  ApiRiskFactors,
  ApiSexWorkMedicalHistory,
  ApiSexWorkRiskContact,
  ApiStiProtectionProcedure,
} from "@eshg/sti-protection-api";

import {
  guardValue,
  mapOptional,
} from "@/lib/businessModules/stiProtection/shared/helpers";

import {
  ExaminationData,
  GeneralData,
  MedicalHistoryFormData,
  PreventionData,
  PreviousIllnessesForm,
  SexualOrientationAndContactData,
  StandardExaminationQuestion,
  StandardRiskQuestion,
  defaultExaminations,
} from "./MedicalHistoryForm.config";

function mapApiExaminationToForm(
  examinations?: ApiExamination,
): ExaminationData {
  if (examinations === undefined) {
    return defaultExaminations;
  }

  return {
    hepA: mapToExaminationFormQuestion(
      examinations.hepA,
      examinations.hepADate,
    ),
    hepB: mapToExaminationFormQuestion(
      examinations.hepB,
      examinations.hepBDate,
    ),
    hepC: mapToExaminationFormQuestion(
      examinations.hepC,
      examinations.hepCDate,
    ),
    hiv: mapToExaminationFormQuestion(examinations.hiv, examinations.hivDate),
    syphilis: mapToExaminationFormQuestion(
      examinations.syphilis,
      examinations.syphilisDate,
    ),
    gonorrhea: mapToExaminationFormQuestion(
      examinations.gonorrhea,
      examinations.gonorrheaDate,
    ),
    chlamydia: mapToExaminationFormQuestion(
      examinations.chlamydia,
      examinations.chlamydiaDate,
    ),
  };
}

function mapToExaminationFormQuestion(
  option: boolean | undefined,
  examinationDate: Date | undefined,
): StandardExaminationQuestion {
  return {
    hadExamination: mapBoolToYesOrNo(option),
    examinationDate: {
      month: examinationDate?.getMonth() ?? null,
      year: examinationDate?.getFullYear() ?? "",
    },
  };
}

export function mapToFormValues(
  apiData: ApiGetMedicalHistory200Response,
): MedicalHistoryFormData {
  return {
    general: mapApiGeneralToForm(apiData),
    examinations: mapApiExaminationToForm(apiData.examinations),
    previousIllnesses: mapApiPreviousIllnessesToForm(apiData.previousIllnesses),
    sexualOrientationAndContact: {
      numberOfSexualPartnersLast12Months:
        apiData.riskContacts?.numberOfSexualPartnersLast12Months ?? "",
      sexualContactFactors:
        fromSet(apiData.riskContacts?.partnerRiskFactors) ?? [],
      sexualContactGenders: fromSet(apiData.riskContacts?.sexualContacts),
      sexualOrientation: apiData.riskContacts?.sexualOrientation ?? null,
      startInSexWork: mapToMonthAndYear(
        ifSexWork(apiData, (d) => d.sexWorkRiskContacts?.startInSexWorkDate),
      ),
      sexWorkType:
        ifSexWork(apiData, (d) =>
          fromSet(d.sexWorkRiskContacts?.sexWorkLocations),
        ) ?? [],
    },
    prevention: {
      infoAboutPrepDesired: mapBoolToYesOrNo(
        apiData.prevention?.infoAboutPrepDesired,
      ),
      safeSexRegularity: apiData.prevention?.safeSexPractice ?? "",
      stiProtectiveMeasures: fromSet(apiData.prevention?.protectionMethodsUsed),
      vaccinations: fromSet(apiData.prevention?.vaccinations),
    },
    standardRiskFactors: {
      unprotectedVaginal: mapRiskQuestion(
        apiData.riskFactors?.riskActivityDateVaginalIntercourse,
        apiData.riskFactors?.riskActivityDateVaginalIntercourseDate,
      ),
      unprotectedAnal: mapRiskQuestion(
        apiData.riskFactors?.riskActivityDateAnalIntercourse,
        apiData.riskFactors?.riskActivityDateAnalIntercourseDate,
      ),
      unprotectedOral: mapRiskQuestion(
        apiData.riskFactors?.riskActivityDateOralIntercourse,
        apiData.riskFactors?.riskActivityDateOralIntercourseDate,
      ),
    },
    otherRisks: {
      taken: mapBoolToYesOrNo(apiData.riskFactors?.otherRiskActivities),
      description: apiData.riskFactors?.otherRiskActivitiesData ?? "",
    },
    remarks: apiData.additionalComments ?? "",
  };
}
function mapApiPreviousIllnessesToForm(
  apiData: ApiPreviousIllness | undefined,
): PreviousIllnessesForm {
  return {
    chlamydia: mapBoolToYesOrNo(apiData?.chlamydia),
    gonorrhea: mapBoolToYesOrNo(apiData?.gonorrhea),
    hepA: mapBoolToYesOrNo(apiData?.hepA),
    hepB: mapBoolToYesOrNo(apiData?.hepB),
    hepC: mapBoolToYesOrNo(apiData?.hepC),
    hiv: mapBoolToYesOrNo(apiData?.hiv),
    syphilis: mapBoolToYesOrNo(apiData?.syphilis),
    other: mapBoolToYesOrNo(apiData?.other),
    otherData: apiData?.otherData ?? "",
  };
}
function mapApiGeneralToForm(
  apiData: ApiGetMedicalHistory200Response,
): GeneralData {
  return {
    examinationReason: apiData.examinationReason ?? "",
    relationshipModel: apiData.relationshipModel ?? "",
    contactToClarifyDate: toISODateString(apiData.contactToClarifyDate) ?? "",
    currentSymptoms: apiData.currentSymptoms ?? "",
    lastCancerScreening:
      ifSexWork(apiData, (s) => toISODateString(s.lastCancerScreeningDate)) ??
      "",
    lastMenstruation:
      ifSexWork(apiData, (s) => toISODateString(s.lastMenstruationDate)) ?? "",
    hasBeenPregnant:
      ifSexWork(apiData, (s) => mapBoolToYesOrNo(s.previouslyPregnant)) ?? null,
    medications: ifSexWork(apiData, (s) => s.medications) ?? "",
    knownOperationsOrIllnesses:
      ifSexWork(apiData, (s) => s.knownOperations) ?? "",
    numberOfBirthsOrAbortions:
      ifSexWork(apiData, (s) => s.amountAbortions) ?? "",
    numberOfPregnancies: ifSexWork(apiData, (s) => s.amountPregnancies) ?? "",
  };
}

function ifSexWork<T>(
  data: ApiGetMedicalHistory200Response,
  predicate: (d: ApiSexWorkMedicalHistory) => T,
): T | undefined {
  if (data.type !== "SexWorkMedicalHistory") {
    return;
  }
  return predicate(data);
}

function toISODateString(d: Date | undefined | null) {
  if (d === undefined || d === null) {
    return;
  }
  return d.toISOString().slice(0, 10);
}

function fromSet<T>(set: Set<T> | null | undefined): T[] {
  if (set === undefined || set === null) {
    return [];
  }
  return Array.from(set);
}

function mapRiskQuestion(
  hasRisk: boolean | undefined,
  date: Date | undefined,
): StandardRiskQuestion {
  return {
    taken: mapBoolToYesOrNo(hasRisk),
    lastIncident: mapToMonthAndYear(date),
  };
}

function mapToMonthAndYear(date: Date | null | undefined): MonthAndYear {
  if (date === undefined || date === null) {
    return { month: null, year: "" };
  }
  return { month: date.getMonth(), year: date.getFullYear() };
}

export function mapFormValuesToApi(
  procedure: ApiStiProtectionProcedure,
  form: MedicalHistoryFormData,
): ApiCreateMedicalHistoryRequest {
  return {
    medicalHistory: {
      type:
        procedure.concern === "SEX_WORK"
          ? "SexWorkMedicalHistory"
          : "StiConsultationMedicalHistory",

      ...mapGeneralToApi(form.general),

      examinations: mapExaminationsToApi(form.examinations),

      previousIllnesses: mapPreviousIllnessesToApi(form.previousIllnesses),

      riskContacts: mapRiskContactsToApi(form.sexualOrientationAndContact),
      riskFactors: mapRiskFactorsToApi(form),
      prevention: mapPreventionToApi(form.prevention),
      sexWorkRiskContacts: mapSexWorkRiskContactsToApi(
        form.sexualOrientationAndContact,
      ),
      additionalComments: mapOptionalValue(form.remarks),
    },
  };
}

function mapGeneralToApi(form: GeneralData) {
  return {
    examinationReason: form.examinationReason,
    currentSymptoms: form.currentSymptoms,
    contactToClarifyDate: mapOptionalDate(form.contactToClarifyDate),
    relationshipModel: mapOptionalValue(form.relationshipModel),
    lastMenstruationDate: mapOptionalDate(form.lastMenstruation),
    lastCancerScreeningDate: mapOptionalDate(form.lastCancerScreening),
    previouslyPregnant: mapYesOrNoToBool(form.hasBeenPregnant),
    amountAbortions: guardValue(
      mapYesOrNoToBool(form.hasBeenPregnant),
      mapOptionalValue(form.numberOfBirthsOrAbortions),
    ),
    amountPregnancies: guardValue(
      mapYesOrNoToBool(form.hasBeenPregnant),
      mapOptionalValue(form.numberOfPregnancies),
    ),
    medications: mapOptionalValue(form.medications),
    knownOperations: mapOptionalValue(form.knownOperationsOrIllnesses),
  } as const satisfies Partial<ApiGetMedicalHistory200Response>;
}

function mapSexWorkRiskContactsToApi(
  form: SexualOrientationAndContactData,
): ApiSexWorkRiskContact {
  return {
    startInSexWorkDate: mapMonthAndYear(form.startInSexWork),
    sexWorkLocations: new Set(form.sexWorkType),
  };
}

function mapRiskFactorsToApi({
  standardRiskFactors,
  otherRisks,
}: MedicalHistoryFormData): ApiRiskFactors {
  return {
    riskActivityDateVaginalIntercourseDate: guardValue(
      mapYesOrNoToBool(standardRiskFactors.unprotectedVaginal.taken),
      mapMonthAndYear(standardRiskFactors.unprotectedVaginal.lastIncident),
    ),
    riskActivityDateVaginalIntercourse: mapYesOrNoToBool(
      standardRiskFactors.unprotectedVaginal.taken,
    ),
    riskActivityDateAnalIntercourseDate: guardValue(
      mapYesOrNoToBool(standardRiskFactors.unprotectedAnal.taken),
      mapMonthAndYear(standardRiskFactors.unprotectedAnal.lastIncident),
    ),
    riskActivityDateAnalIntercourse: mapYesOrNoToBool(
      standardRiskFactors.unprotectedAnal.taken,
    ),
    riskActivityDateOralIntercourseDate: guardValue(
      mapYesOrNoToBool(standardRiskFactors.unprotectedOral.taken),
      mapMonthAndYear(standardRiskFactors.unprotectedOral.lastIncident),
    ),
    riskActivityDateOralIntercourse: mapYesOrNoToBool(
      standardRiskFactors.unprotectedOral.taken,
    ),
    otherRiskActivitiesData: guardValue(
      mapYesOrNoToBool(otherRisks.taken),
      otherRisks.description,
    ),
    otherRiskActivities: mapYesOrNoToBool(otherRisks.taken),
  };
}

function mapPreventionToApi(prevention: PreventionData): ApiPrevention {
  return {
    infoAboutPrepDesired: mapYesOrNoToBool(prevention.infoAboutPrepDesired),
    protectionMethodsUsed: new Set(prevention.stiProtectiveMeasures),
    safeSexPractice: mapOptionalValue(prevention.safeSexRegularity),
    vaccinations: new Set(prevention.vaccinations),
  };
}

function mapRiskContactsToApi(
  form: SexualOrientationAndContactData,
): ApiRiskContact {
  return {
    numberOfSexualPartnersLast12Months: mapOptionalValue(
      form.numberOfSexualPartnersLast12Months,
    ),
    partnerRiskFactors: new Set(form.sexualContactFactors),
    sexualContacts: new Set(form.sexualContactGenders),
    sexualOrientation: mapOptionalValue(form.sexualOrientation ?? ""),
  };
}

function mapPreviousIllnessesToApi(
  form: PreviousIllnessesForm,
): ApiPreviousIllness {
  return {
    chlamydia: mapYesOrNoToBool(form.chlamydia),
    gonorrhea: mapYesOrNoToBool(form.gonorrhea),
    hepA: mapYesOrNoToBool(form.hepA),
    hepB: mapYesOrNoToBool(form.hepB),
    hepC: mapYesOrNoToBool(form.hepC),
    hiv: mapYesOrNoToBool(form.hiv),
    other: mapYesOrNoToBool(form.other),
    otherData: guardValue(mapYesOrNoToBool(form.other), form.otherData),
    syphilis: mapYesOrNoToBool(form.syphilis),
  };
}

function mapExaminationsToApi(form: ExaminationData): ApiExamination {
  return {
    chlamydia: mapYesOrNoToBool(form.chlamydia.hadExamination),
    chlamydiaDate: guardValue(
      mapYesOrNoToBool(form.chlamydia.hadExamination),
      mapMonthAndYear(form.chlamydia.examinationDate),
    ),
    gonorrhea: mapYesOrNoToBool(form.gonorrhea.hadExamination),
    gonorrheaDate: guardValue(
      mapYesOrNoToBool(form.gonorrhea.hadExamination),
      mapMonthAndYear(form.gonorrhea.examinationDate),
    ),
    hepA: mapYesOrNoToBool(form.hepA.hadExamination),
    hepADate: guardValue(
      mapYesOrNoToBool(form.hepA.hadExamination),
      mapMonthAndYear(form.hepA.examinationDate),
    ),
    hepB: mapYesOrNoToBool(form.hepB.hadExamination),
    hepBDate: guardValue(
      mapYesOrNoToBool(form.hepB.hadExamination),
      mapMonthAndYear(form.hepB.examinationDate),
    ),
    hepC: mapYesOrNoToBool(form.hepC.hadExamination),
    hepCDate: guardValue(
      mapYesOrNoToBool(form.hepC.hadExamination),
      mapMonthAndYear(form.hepC.examinationDate),
    ),
    hiv: mapYesOrNoToBool(form.hiv.hadExamination),
    hivDate: guardValue(
      mapYesOrNoToBool(form.hiv.hadExamination),
      mapMonthAndYear(form.hiv.examinationDate),
    ),
    syphilis: mapYesOrNoToBool(form.syphilis.hadExamination),
    syphilisDate: guardValue(
      mapYesOrNoToBool(form.syphilis.hadExamination),
      mapMonthAndYear(form.syphilis.examinationDate),
    ),
  };
}

function mapOptionalDate(nullableValue: string | null) {
  return mapOptional(nullableValue, (d) =>
    d === "" ? undefined : new Date(d),
  );
}
