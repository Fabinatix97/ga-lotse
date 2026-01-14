/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { parseOptionalValue } from "@eshg/lib-portal";
import {
  AnamnesisFormValues,
  mapAnamnesis,
} from "@eshg/official-medical-service";
import {
  ApiGetAnamnesisResponse,
  PatchAnamnesisRequest,
} from "@eshg/official-medical-service-api";

export function mapToFormValues(
  response: ApiGetAnamnesisResponse,
): AnamnesisFormValues {
  return {
    affectedPersonInfo: mapAffectedPersonInfoToForm(response),
    currentHealthConditionInfo: mapCurrentHealthConditionInfoToForm(response),
    healthFitnessAndDisabilityInfo:
      mapHealthFitnessAndDisabilityInfoToForm(response),
    medicalHistoryInfo: mapMedicalHistoryInfoToForm(response),
    retirementInfo: mapRetirementInfoToForm(response),
  };
}

function mapAffectedPersonInfoToForm(response: ApiGetAnamnesisResponse) {
  return {
    fillingPerson: parseOptionalValue(
      response.anamnesis?.affectedPersonInfo.fillingPerson,
    ),
    maritalStatus: parseOptionalValue(
      response.anamnesis?.affectedPersonInfo.maritalStatus,
    ),
    numberOfChildren: parseOptionalValue(
      response.anamnesis?.affectedPersonInfo.numberOfChildren,
    ),
    occupation: parseOptionalValue(
      response.anamnesis?.affectedPersonInfo.occupation,
    ),
    yearsOfBirthOfChildren:
      response.anamnesis?.affectedPersonInfo.yearsOfBirthOfChildren ?? [],
  };
}

function mapCurrentHealthConditionInfoToForm(
  response: ApiGetAnamnesisResponse,
) {
  return {
    currentMedicalConditionsInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.currentHealthConditionInfo
          .currentMedicalConditionsInfo.answer,
      ),
      descriptionOfCondition:
        response.anamnesis?.currentHealthConditionInfo
          .currentMedicalConditionsInfo.descriptionOfCondition ?? [],
      particulars: parseOptionalValue(
        response.anamnesis?.currentHealthConditionInfo
          .currentMedicalConditionsInfo.particulars,
      ),
    },
    healthyAndCapableInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.currentHealthConditionInfo.healthyAndCapableInfo
          .answer,
      ),
    },
    medicalImagingFindingsInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.currentHealthConditionInfo
          .medicalImagingFindingsInfo.answer,
      ),
      result: parseOptionalValue(
        response.anamnesis?.currentHealthConditionInfo
          .medicalImagingFindingsInfo.result,
      ),
    },
    medicationDietarySupplementsOrDrugsInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.currentHealthConditionInfo
          .medicationDietarySupplementsOrDrugsInfo.answer,
      ),
      substances: parseOptionalValue(
        response.anamnesis?.currentHealthConditionInfo
          .medicationDietarySupplementsOrDrugsInfo.substances,
      ),
    },
    opticalAidInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.currentHealthConditionInfo.opticalAidInfo.answer,
      ),
    },
    primaryCareDoctorOrAttendingPhysician: parseOptionalValue(
      response.anamnesis?.currentHealthConditionInfo
        .primaryCareDoctorOrAttendingPhysician,
    ),
    sportsInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.currentHealthConditionInfo.sportsInfo.answer,
      ),
      formOfSport: parseOptionalValue(
        response.anamnesis?.currentHealthConditionInfo.sportsInfo.formOfSport,
      ),
    },
  };
}

function mapHealthFitnessAndDisabilityInfoToForm(
  response: ApiGetAnamnesisResponse,
) {
  return {
    disabilityInfo: {
      degree: parseOptionalValue(
        response.anamnesis?.healthFitnessAndDisabilityInfo.disabilityInfo
          .degree,
      ),
      hasDisability: parseOptionalValue(
        response.anamnesis?.healthFitnessAndDisabilityInfo.disabilityInfo
          .hasDisability,
      ),
      reason: parseOptionalValue(
        response.anamnesis?.healthFitnessAndDisabilityInfo.disabilityInfo
          .reason,
      ),
    },
    priorExaminationInfo: {
      hasPriorExaminations: parseOptionalValue(
        response.anamnesis?.healthFitnessAndDisabilityInfo.priorExaminationInfo
          .hasPriorExaminations,
      ),
      place: parseOptionalValue(
        response.anamnesis?.healthFitnessAndDisabilityInfo.priorExaminationInfo
          .place,
      ),
      reason: parseOptionalValue(
        response.anamnesis?.healthFitnessAndDisabilityInfo.priorExaminationInfo
          .reason,
      ),
      result: parseOptionalValue(
        response.anamnesis?.healthFitnessAndDisabilityInfo.priorExaminationInfo
          .result,
      ),
      year: parseOptionalValue(
        response.anamnesis?.healthFitnessAndDisabilityInfo.priorExaminationInfo
          .year,
      ),
    },
  };
}

function mapMedicalHistoryInfoToForm(response: ApiGetAnamnesisResponse) {
  return {
    addictionsInfo: {
      amount: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.addictionsInfo?.amount,
      ),
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.addictionsInfo?.answer,
      ),
      description: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.addictionsInfo?.description,
      ),
      notAnymoreSince: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.addictionsInfo?.notAnymoreSince,
      ),
      since: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.addictionsInfo?.since,
      ),
      which:
        response.anamnesis?.medicalHistoryInfo?.addictionsInfo?.which ?? [],
    },
    allergiesAndIntoleranceInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.allergiesAndIntoleranceInfo
          ?.answer,
      ),
      which: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.allergiesAndIntoleranceInfo
          ?.which,
      ),
    },
    bladderKidneysAbdominalOrganInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.bladderKidneysAbdominalOrganInfo
          ?.answer,
      ),
    },
    boneFractureBrainTraumaInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.boneFractureBrainTraumaInfo
          ?.answer,
      ),
      description: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.boneFractureBrainTraumaInfo
          ?.description,
      ),
      whatWhenAndWhere: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.boneFractureBrainTraumaInfo
          ?.whatWhenAndWhere,
      ),
    },
    bonesJointsAndSpineInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.bonesJointsAndSpineInfo?.answer,
      ),
      which: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.bonesJointsAndSpineInfo?.which,
      ),
    },
    bronchiaLungsInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.bronchiaLungsInfo?.answer,
      ),
    },
    cancerInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.cancerInfo?.answer,
      ),
      chemoRadiationTherapy: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.cancerInfo
          ?.chemoRadiationTherapy,
      ),
      whichAndWhen: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.cancerInfo?.whichAndWhen,
      ),
    },
    diabetesInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.diabetesInfo?.answer,
      ),
    },
    earNoseThroatInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.earNoseThroatInfo?.answer,
      ),
    },
    eatingDisorderInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.eatingDisorderInfo?.answer,
      ),
      which:
        response.anamnesis?.medicalHistoryInfo?.eatingDisorderInfo?.which ?? [],
    },
    hadPastDiseasesOrDisabilities: parseOptionalValue(
      response.anamnesis?.medicalHistoryInfo?.hadPastDiseasesOrDisabilities,
    ),
    heartDiseaseInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.heartDiseaseInfo?.answer,
      ),
      bypass: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.heartDiseaseInfo?.bypass,
      ),
      stent: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.heartDiseaseInfo?.stent,
      ),
      which:
        response.anamnesis?.medicalHistoryInfo?.heartDiseaseInfo?.which ?? [],
    },
    liverInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.liverInfo?.answer,
      ),
    },
    mentalIllnessInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.mentalIllnessInfo?.answer,
      ),
      description: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.mentalIllnessInfo?.description,
      ),
      which:
        response.anamnesis?.medicalHistoryInfo?.mentalIllnessInfo?.which ?? [],
    },
    miscellaneousInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.miscellaneousInfo?.answer,
      ),
      description: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.miscellaneousInfo?.description,
      ),
    },
    nervousSystemInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.nervousSystemInfo?.answer,
      ),
    },
    overweightInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.overweightInfo?.answer,
      ),
      description: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.overweightInfo?.description,
      ),
      heightInCm: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.overweightInfo?.heightInCm,
      ),
      weightInKg: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.overweightInfo?.weightInKg,
      ),
    },
    stomachAndIntestinesInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.stomachAndIntestinesInfo
          ?.answer,
      ),
    },
    thyroidInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.thyroidInfo?.answer,
      ),
      which: response.anamnesis?.medicalHistoryInfo?.thyroidInfo?.which ?? [],
    },
    tuberculosisInfo: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.tuberculosisInfo?.answer,
      ),
    },
  };
}

function mapRetirementInfoToForm(response: ApiGetAnamnesisResponse) {
  return {
    appliedForRetirement: parseOptionalValue(
      response.anamnesis?.retirementInfo.appliedForRetirement,
    ),
    reason: parseOptionalValue(response.anamnesis?.retirementInfo.reason),
    reductionOfEarningCapacity: parseOptionalValue(
      response.anamnesis?.retirementInfo.reductionOfEarningCapacity,
    ),
  };
}

export function mapToRequest(
  procedureId: string,
  values: AnamnesisFormValues,
): PatchAnamnesisRequest {
  return {
    id: procedureId,
    apiUpdateAnamnesisRequest: {
      anamnesis: mapAnamnesis(values),
    },
  };
}
