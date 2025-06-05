/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isPlainObject } from "remeda";

import {
  OptionalFieldValue,
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal";
import {
  ApiAnamnesis,
  ApiHeartDisease,
  ApiYesNoDontKnowAnswer,
} from "@eshg/official-medical-service-api";

import {
  AffectedPersonInfoValues,
  AnamnesisFormValues,
  CurrentHealthConditionInfoValues,
  HealthFitnessAndDisabilityInfoValues,
  HeartDiseaseSegment,
  MedicalHistoryInfoValues,
  RetirementInfoValues,
} from "../config/form";

export function cleanOptionalValues(
  obj: AnamnesisFormValues,
): AnamnesisFormValues {
  return _cleanOptionalValues(obj as unknown as Record<string, unknown>, [
    { key: "hasPriorExaminations", value: false },
    { key: "hasDisability", value: false },
    { key: "appliedForRetirement", value: false },
    { key: "hadPastDiseasesOrDisabilities", value: false },
    { key: "answer", value: false },
    { key: "answer", value: ApiYesNoDontKnowAnswer.No },
    { key: "answer", value: ApiYesNoDontKnowAnswer.DontKnow },
  ]) as unknown as AnamnesisFormValues;
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

export function mapAnamnesis(values: AnamnesisFormValues): ApiAnamnesis {
  return {
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
        bypass: mapBypassOrStent(
          values.heartDiseaseInfo,
          values.heartDiseaseInfo.bypass,
        ),
        stent: mapBypassOrStent(
          values.heartDiseaseInfo,
          values.heartDiseaseInfo.stent,
        ),
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
      tuberculosisInfo: {
        answer: mapRequiredValue(values.tuberculosisInfo.answer),
      },
    };
  }
  return values;
}

function mapBypassOrStent(
  heartDiseaseInfo: HeartDiseaseSegment,
  bypassOrStent: OptionalFieldValue<boolean | undefined>,
) {
  if (
    mapRequiredValue(heartDiseaseInfo.answer) === ApiYesNoDontKnowAnswer.Yes &&
    mapOptionalValue(heartDiseaseInfo.which)?.includes(
      ApiHeartDisease.CoronaryHeartDisease,
    )
  ) {
    return mapOptionalValue(bypassOrStent) ?? false;
  } else {
    return undefined;
  }
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
