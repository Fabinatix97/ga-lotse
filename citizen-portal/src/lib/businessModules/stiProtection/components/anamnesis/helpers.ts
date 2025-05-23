/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  mapMonthAndYear,
  mapOptionalValue,
  mapYesOrNoToBool,
} from "@eshg/lib-portal";
import {
  ApiConcern,
  ApiCreateMedicalHistoryRequest,
  ApiExamination,
  ApiGetMedicalHistory200Response,
  ApiPrevention,
  ApiPreviousIllness,
  ApiRiskContact,
  ApiRiskFactors,
  ApiSexWorkRiskContact,
} from "@eshg/sti-protection-api";

import {
  ExaminationData,
  FormDataWithoutConcern,
  GeneralData,
  PreventionData,
  PreviousIllnessesForm,
  SexualOrientationAndContactData,
} from "./AnamnesisStepper.config";

function guardValue<T>(
  guard: boolean | null | undefined,
  value: T,
): T | undefined {
  return guard ? value : undefined;
}

function mapOptional<T, K>(
  val: T | undefined | null,
  predicate: (t: T) => K,
): K | undefined {
  if (val == null) {
    return;
  }
  return predicate(val);
}

export function mapFormValuesToApi({
  concern,
  formValues,
}: {
  concern: ApiConcern;
  formValues: FormDataWithoutConcern;
}): ApiCreateMedicalHistoryRequest {
  return {
    medicalHistory: {
      type:
        concern === ApiConcern.SexWork
          ? "SexWorkMedicalHistory"
          : "StiConsultationMedicalHistory",

      ...mapGeneralToApi(formValues.general),

      examinations: mapExaminationsToApi(formValues.examinations),

      previousIllnesses: mapPreviousIllnessesToApi(
        formValues.previousIllnesses,
      ),

      riskContacts: mapRiskContactsToApi(
        formValues.sexualOrientationAndContact,
      ),
      riskFactors: mapRiskFactorsToApi(formValues),
      prevention: mapPreventionToApi(formValues.prevention),
      sexWorkRiskContacts: mapSexWorkRiskContactsToApi(
        formValues.sexualOrientationAndContact,
      ),
      additionalComments: mapOptionalValue(formValues.remarks),
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
}: FormDataWithoutConcern): ApiRiskFactors {
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
