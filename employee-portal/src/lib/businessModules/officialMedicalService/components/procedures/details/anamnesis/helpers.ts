/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isPlainObject } from "next/dist/shared/lib/is-plain-object";

import {
  mapOptionalValue,
  mapRequiredValue,
  parseOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import {
  ApiGetAnamnesisResponse,
  ApiYesNoDontKnowAnswer,
  PatchAnamnesisRequest,
} from "@eshg/official-medical-service-api";

import {
  AffectedPersonInfoValues,
  AnamnesisFormValues,
  CurrentHealthConditionInfoValues,
  HealthFitnessAndDisabilityInfoValues,
  MedicalHistoryInfoValues,
  RetirementInfoValues,
} from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/AnamnesisForm.config";

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
    tuberculosis: {
      answer: parseOptionalValue(
        response.anamnesis?.medicalHistoryInfo?.tuberculosis?.answer,
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

export function cleanOptionalValues(
  obj: AnamnesisFormValues,
  anchors: { key: string; value: boolean | ApiYesNoDontKnowAnswer }[],
): AnamnesisFormValues {
  return _cleanOptionalValues(
    obj as unknown as Record<string, unknown>,
    anchors,
  ) as unknown as AnamnesisFormValues;
  // Note: this function potentially sets all fields in a member of AnamnesisFormValues except the anchor to undefined. This relies on all fields being optional.
}

function _cleanOptionalValues(
  obj: Record<string, unknown>,
  anchors: { key: string; value: boolean | ApiYesNoDontKnowAnswer }[],
): Record<string, unknown> {
  for (const anchor of anchors) {
    const { key, value } = anchor;
    if (key in obj && obj[key] === value) {
      return Object.fromEntries(
        Object.entries(obj).map(([k, value]) => {
          if (k === key) {
            return [k, value];
          }
          return [k, undefined];
        }),
      );
    }
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (isRecord(value)) {
        return [key, _cleanOptionalValues(value, anchors)];
      }
      return [key, value];
    }),
  );
}

function isRecord(obj: unknown): obj is Record<string, unknown> {
  return isPlainObject(obj);
}

export function mapToRequest(
  procedureId: string,
  values: AnamnesisFormValues,
): PatchAnamnesisRequest {
  return {
    id: procedureId,
    apiUpdateAnamnesisRequest: {
      anamnesis: {
        affectedPersonInfo: mapAffectedPersonInfo(values.affectedPersonInfo),
        currentHealthConditionInfo: mapCurrentHealthConditionInfo(
          values.currentHealthConditionInfo,
        ),
        healthFitnessAndDisabilityInfo: mapHealthFitnessAndDisabilityInfo(
          values.healthFitnessAndDisabilityInfo,
        ),
        // @ts-expect-error wrong type of answer provided - is never going to be empty string
        medicalHistoryInfo: mapMedicalHistoryInfo(values.medicalHistoryInfo),
        retirementInfo: mapRetirementInfo(values.retirementInfo),
      },
    },
  };
}

function mapAffectedPersonInfo(values: AffectedPersonInfoValues) {
  return {
    fillingPerson: mapRequiredValue(values.fillingPerson),
    maritalStatus: mapRequiredValue(values.maritalStatus),
    numberOfChildren: mapRequiredValue(values.numberOfChildren),
    occupation: mapOptionalValue(values.occupation),
    yearsOfBirthOfChildren: mapOptionalValue(values.yearsOfBirthOfChildren),
  };
}

function mapCurrentHealthConditionInfo(
  values: CurrentHealthConditionInfoValues,
) {
  return {
    currentMedicalConditionsInfo: {
      answer: mapRequiredValue(values.currentMedicalConditionsInfo.answer),
      descriptionOfCondition: mapOptionalValue(
        values.currentMedicalConditionsInfo.descriptionOfCondition,
      ),
      particulars: mapOptionalValue(
        values.currentMedicalConditionsInfo.particulars,
      ),
    },
    healthyAndCapableInfo: {
      answer: mapRequiredValue(values.healthyAndCapableInfo.answer),
    },
    medicalImagingFindingsInfo: {
      answer: mapRequiredValue(values.medicalImagingFindingsInfo.answer),
      result: mapOptionalValue(values.medicalImagingFindingsInfo.result),
    },
    medicationDietarySupplementsOrDrugsInfo: {
      answer: mapRequiredValue(
        values.medicationDietarySupplementsOrDrugsInfo.answer,
      ),
      substances: mapOptionalValue(
        values.medicationDietarySupplementsOrDrugsInfo.substances,
      ),
    },
    opticalAidInfo: {
      answer: mapRequiredValue(values.opticalAidInfo.answer),
    },
    primaryCareDoctorOrAttendingPhysician:
      values.primaryCareDoctorOrAttendingPhysician,
    sportsInfo: {
      answer: mapRequiredValue(values.sportsInfo.answer),
      formOfSport: mapOptionalValue(values.sportsInfo.formOfSport),
    },
  };
}

function mapHealthFitnessAndDisabilityInfo(
  values: HealthFitnessAndDisabilityInfoValues,
) {
  return {
    disabilityInfo: {
      degree: mapOptionalValue(values.disabilityInfo.degree),
      hasDisability: mapRequiredValue(values.disabilityInfo.hasDisability),
      reason: mapOptionalValue(values.disabilityInfo.reason),
    },
    priorExaminationInfo: {
      hasPriorExaminations: mapRequiredValue(
        values.priorExaminationInfo.hasPriorExaminations,
      ),
      place: mapOptionalValue(values.priorExaminationInfo.place),
      reason: mapOptionalValue(values.priorExaminationInfo.reason),
      result: mapOptionalValue(values.priorExaminationInfo.result),
      year: mapOptionalValue(values.priorExaminationInfo.year),
    },
  };
}

function mapMedicalHistoryInfo(values: MedicalHistoryInfoValues) {
  if (values.hadPastDiseasesOrDisabilities) {
    return {
      addictionsInfo: {
        amount: mapOptionalValue(values.addictionsInfo.amount),
        answer: mapRequiredValue(values.addictionsInfo.answer),
        description: mapOptionalValue(values.addictionsInfo.description),
        notAnymoreSince: mapOptionalValue(
          values.addictionsInfo.notAnymoreSince,
        ),
        since: mapOptionalValue(values.addictionsInfo.since),
        which: mapOptionalValue(values.addictionsInfo.which),
      },
      allergiesAndIntoleranceInfo: {
        answer: mapRequiredValue(values.allergiesAndIntoleranceInfo.answer),
        which: mapOptionalValue(values.allergiesAndIntoleranceInfo.which),
      },
      bladderKidneysAbdominalOrganInfo: {
        answer: mapRequiredValue(
          values.bladderKidneysAbdominalOrganInfo.answer,
        ),
      },
      boneFractureBrainTraumaInfo: {
        answer: mapRequiredValue(values.boneFractureBrainTraumaInfo.answer),
        description: mapOptionalValue(
          values.boneFractureBrainTraumaInfo.description,
        ),
        whatWhenAndWhere: mapOptionalValue(
          values.boneFractureBrainTraumaInfo.whatWhenAndWhere,
        ),
      },
      bonesJointsAndSpineInfo: {
        answer: mapRequiredValue(values.bonesJointsAndSpineInfo.answer),
        which: mapOptionalValue(values.bonesJointsAndSpineInfo.which),
      },
      bronchiaLungsInfo: {
        answer: mapRequiredValue(values.bronchiaLungsInfo.answer),
      },
      cancerInfo: {
        answer: mapRequiredValue(values.cancerInfo.answer),
        chemoRadiationTherapy: mapOptionalValue(
          values.cancerInfo.chemoRadiationTherapy,
        ),
        whichAndWhen: mapOptionalValue(values.cancerInfo.whichAndWhen),
      },
      diabetesInfo: {
        answer: mapRequiredValue(values.diabetesInfo.answer),
      },
      earNoseThroatInfo: {
        answer: mapRequiredValue(values.earNoseThroatInfo.answer),
      },
      eatingDisorderInfo: {
        answer: mapRequiredValue(values.eatingDisorderInfo.answer),
        which: mapOptionalValue(values.eatingDisorderInfo.which),
      },
      hadPastDiseasesOrDisabilities: mapRequiredValue(
        values.hadPastDiseasesOrDisabilities,
      ),
      heartDiseaseInfo: {
        answer: mapRequiredValue(values.heartDiseaseInfo.answer),
        bypass: mapOptionalValue(values.heartDiseaseInfo.bypass),
        stent: mapOptionalValue(values.heartDiseaseInfo.stent),
        which: mapOptionalValue(values.heartDiseaseInfo.which),
      },
      liverInfo: {
        answer: mapRequiredValue(values.liverInfo.answer),
      },
      mentalIllnessInfo: {
        answer: mapRequiredValue(values.mentalIllnessInfo.answer),
        description: mapOptionalValue(values.mentalIllnessInfo.description),
        which: mapOptionalValue(values.mentalIllnessInfo.which),
      },
      miscellaneousInfo: {
        answer: mapRequiredValue(values.miscellaneousInfo.answer),
        description: mapOptionalValue(values.miscellaneousInfo.description),
      },
      nervousSystemInfo: {
        answer: mapRequiredValue(values.nervousSystemInfo.answer),
      },
      overweightInfo: {
        answer: mapRequiredValue(values.overweightInfo.answer),
        description: mapOptionalValue(values.overweightInfo.description),
        heightInCm: mapOptionalValue(values.overweightInfo.heightInCm),
        weightInKg: mapOptionalValue(values.overweightInfo.weightInKg),
      },
      stomachAndIntestinesInfo: {
        answer: mapRequiredValue(values.stomachAndIntestinesInfo.answer),
      },
      thyroidInfo: {
        answer: mapRequiredValue(values.thyroidInfo.answer),
        which: mapOptionalValue(values.thyroidInfo.which),
      },
      tuberculosis: {
        answer: mapRequiredValue(values.tuberculosis.answer),
      },
    };
  }
  return values;
}

function mapRetirementInfo(values: RetirementInfoValues) {
  return {
    appliedForRetirement: mapRequiredValue(values.appliedForRetirement),
    reason: mapOptionalValue(values.reason),
    reductionOfEarningCapacity: mapOptionalValue(
      values.reductionOfEarningCapacity,
    ),
  };
}
