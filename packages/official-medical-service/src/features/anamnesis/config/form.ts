/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OptionalFieldValue } from "@eshg/lib-portal";
import {
  ApiAddiction,
  ApiCurrentMedicalCondition,
  ApiEatingDisorder,
  ApiFillingPerson,
  ApiHeartDisease,
  ApiMaritalStatus,
  ApiMentalIllness,
  ApiOpticalAidAnswer,
  ApiThyroidDisease,
  ApiYesNoDontKnowAnswer,
} from "@eshg/official-medical-service-api";

export interface AnamnesisFormValues {
  affectedPersonInfo: AffectedPersonInfoValues;
  currentHealthConditionInfo: CurrentHealthConditionInfoValues;
  healthFitnessAndDisabilityInfo: HealthFitnessAndDisabilityInfoValues;
  medicalHistoryInfo: MedicalHistoryInfoValues;
  retirementInfo: RetirementInfoValues;
}

export interface AffectedPersonInfoValues {
  fillingPerson: OptionalFieldValue<ApiFillingPerson>;
  maritalStatus: OptionalFieldValue<ApiMaritalStatus>;
  numberOfChildren: OptionalFieldValue<number>;
  occupation?: string;
  yearsOfBirthOfChildren: number[];
}

export interface CurrentHealthConditionInfoValues {
  currentMedicalConditionsInfo: CurrentMedicalConditionSegmentValues;
  healthyAndCapableInfo: SubInfoSegmentWithAnswerBoolean;
  medicalImagingFindingsInfo: MedicalImagingFindingsInfoSegment;
  medicationDietarySupplementsOrDrugsInfo: MedicationDietarySupplementsOrDrugsSegment;
  opticalAidInfo: SubInfoSegmentWithAnswerOpticalAidAnswer;
  primaryCareDoctorOrAttendingPhysician: OptionalFieldValue<string>;
  sportsInfo: SportsSegment;
}

interface CurrentMedicalConditionSegmentValues {
  answer: OptionalFieldValue<boolean>;
  descriptionOfCondition?: ApiCurrentMedicalCondition[];
  particulars?: string;
}

interface SubInfoSegmentWithAnswerBoolean {
  answer: OptionalFieldValue<boolean>;
}

interface SubInfoSegmentWithAnswerOpticalAidAnswer {
  answer: OptionalFieldValue<ApiOpticalAidAnswer>;
}

interface MedicalImagingFindingsInfoSegment {
  answer: OptionalFieldValue<boolean>;
  result?: string;
}

interface MedicationDietarySupplementsOrDrugsSegment {
  answer: OptionalFieldValue<boolean>;
  substances?: string;
}

interface SportsSegment {
  answer: OptionalFieldValue<boolean>;
  formOfSport?: string;
}

export interface HealthFitnessAndDisabilityInfoValues {
  disabilityInfo: DisabilitySegment;
  priorExaminationInfo: PriorExaminationSegment;
}

interface DisabilitySegment {
  degree?: string;
  hasDisability: OptionalFieldValue<boolean>;
  reason?: string;
}

interface PriorExaminationSegment {
  hasPriorExaminations: OptionalFieldValue<boolean>;
  place?: string;
  reason?: string;
  result?: string;
  year?: OptionalFieldValue<number>;
}

export interface MedicalHistoryInfoValues {
  addictionsInfo: AddictionsSegment;
  allergiesAndIntoleranceInfo: SubInfoSegmentWithAnswerWhichStringYesNoDontKnowAnswer;
  bladderKidneysAbdominalOrganInfo: SubInfoSegmentWithAnswerYesNoDontKnowAnswer;
  boneFractureBrainTraumaInfo: BoneFractureBrainTraumaSegment;
  bonesJointsAndSpineInfo: SubInfoSegmentWithAnswerWhichStringYesNoDontKnowAnswer;
  bronchiaLungsInfo: SubInfoSegmentWithAnswerYesNoDontKnowAnswer;
  cancerInfo: CancerSegment;
  diabetesInfo: SubInfoSegmentWithAnswerYesNoDontKnowAnswer;
  earNoseThroatInfo: SubInfoSegmentWithAnswerYesNoDontKnowAnswer;
  eatingDisorderInfo: SubInfoSegmentWithAnswerWhichEnumListYesNoDontKnowAnswerEatingDisorder;
  hadPastDiseasesOrDisabilities: OptionalFieldValue<boolean>;
  heartDiseaseInfo: HeartDiseaseSegment;
  liverInfo: SubInfoSegmentWithAnswerYesNoDontKnowAnswer;
  mentalIllnessInfo: MentalIllnessSegment;
  miscellaneousInfo: MiscellaneousSegment;
  nervousSystemInfo: SubInfoSegmentWithAnswerYesNoDontKnowAnswer;
  overweightInfo: OverweightSegment;
  stomachAndIntestinesInfo: SubInfoSegmentWithAnswerYesNoDontKnowAnswer;
  thyroidInfo: SubInfoSegmentWithAnswerWhichEnumListYesNoDontKnowAnswerThyroidDisease;
  tuberculosisInfo: SubInfoSegmentWithAnswerYesNoDontKnowAnswer;
}

interface AddictionsSegment {
  amount?: string;
  answer: OptionalFieldValue<ApiYesNoDontKnowAnswer>;
  description?: string;
  notAnymoreSince?: string;
  since?: string;
  which?: ApiAddiction[];
}

interface SubInfoSegmentWithAnswerWhichStringYesNoDontKnowAnswer {
  answer: OptionalFieldValue<ApiYesNoDontKnowAnswer>;
  which?: string;
}

interface SubInfoSegmentWithAnswerYesNoDontKnowAnswer {
  answer: OptionalFieldValue<ApiYesNoDontKnowAnswer>;
}

interface BoneFractureBrainTraumaSegment {
  answer: OptionalFieldValue<ApiYesNoDontKnowAnswer>;
  description?: string;
  whatWhenAndWhere?: string;
}

interface CancerSegment {
  answer: OptionalFieldValue<ApiYesNoDontKnowAnswer>;
  chemoRadiationTherapy?: OptionalFieldValue<boolean>;
  whichAndWhen?: string;
}

interface SubInfoSegmentWithAnswerWhichEnumListYesNoDontKnowAnswerEatingDisorder {
  answer: OptionalFieldValue<ApiYesNoDontKnowAnswer>;
  which?: ApiEatingDisorder[];
}
export interface HeartDiseaseSegment {
  answer: OptionalFieldValue<ApiYesNoDontKnowAnswer>;
  bypass?: OptionalFieldValue<boolean>;
  stent?: OptionalFieldValue<boolean>;
  which?: ApiHeartDisease[];
}

interface MentalIllnessSegment {
  answer: OptionalFieldValue<ApiYesNoDontKnowAnswer>;
  description?: string;
  which?: ApiMentalIllness[];
}

interface MiscellaneousSegment {
  answer: OptionalFieldValue<ApiYesNoDontKnowAnswer>;
  description?: string;
}

interface OverweightSegment {
  answer: OptionalFieldValue<ApiYesNoDontKnowAnswer>;
  description?: string;
  heightInCm?: OptionalFieldValue<number>;
  weightInKg?: OptionalFieldValue<number>;
}

interface SubInfoSegmentWithAnswerWhichEnumListYesNoDontKnowAnswerThyroidDisease {
  answer: OptionalFieldValue<ApiYesNoDontKnowAnswer>;
  which?: ApiThyroidDisease[];
}

export interface RetirementInfoValues {
  appliedForRetirement: OptionalFieldValue<boolean>;
  reason?: string;
  reductionOfEarningCapacity?: string;
}

export function defaultAnamnesisFormValues(): AnamnesisFormValues {
  return {
    affectedPersonInfo: {
      fillingPerson: "",
      maritalStatus: "",
      numberOfChildren: 0,
      occupation: "",
      yearsOfBirthOfChildren: [],
    },
    currentHealthConditionInfo: {
      currentMedicalConditionsInfo: {
        answer: "",
        descriptionOfCondition: [],
        particulars: "",
      },
      healthyAndCapableInfo: {
        answer: "",
      },
      medicalImagingFindingsInfo: {
        answer: "",
        result: "",
      },
      medicationDietarySupplementsOrDrugsInfo: {
        answer: "",
        substances: "",
      },
      opticalAidInfo: {
        answer: "",
      },
      primaryCareDoctorOrAttendingPhysician: "",
      sportsInfo: {
        answer: "",
        formOfSport: "",
      },
    },
    healthFitnessAndDisabilityInfo: {
      disabilityInfo: {
        degree: "",
        hasDisability: "",
        reason: "",
      },
      priorExaminationInfo: {
        hasPriorExaminations: "",
        place: "",
        reason: "",
        result: "",
        year: "",
      },
    },
    medicalHistoryInfo: {
      addictionsInfo: {
        amount: "",
        answer: "",
        description: "",
        notAnymoreSince: "",
        since: "",
        which: [],
      },
      allergiesAndIntoleranceInfo: {
        answer: "",
        which: "",
      },
      bladderKidneysAbdominalOrganInfo: {
        answer: "",
      },
      boneFractureBrainTraumaInfo: {
        answer: "",
        description: "",
        whatWhenAndWhere: "",
      },
      bonesJointsAndSpineInfo: {
        answer: "",
        which: "",
      },
      bronchiaLungsInfo: {
        answer: "",
      },
      cancerInfo: {
        answer: "",
        chemoRadiationTherapy: "",
        whichAndWhen: "",
      },
      diabetesInfo: {
        answer: "",
      },
      earNoseThroatInfo: {
        answer: "",
      },
      eatingDisorderInfo: { answer: "", which: [] },
      hadPastDiseasesOrDisabilities: "",
      heartDiseaseInfo: {
        answer: "",
        bypass: "",
        stent: "",
        which: [],
      },
      liverInfo: {
        answer: "",
      },
      mentalIllnessInfo: {
        answer: "",
        description: "",
        which: [],
      },
      miscellaneousInfo: {
        answer: "",
        description: "",
      },
      nervousSystemInfo: {
        answer: "",
      },
      overweightInfo: {
        answer: "",
        description: "",
        heightInCm: "",
        weightInKg: "",
      },
      stomachAndIntestinesInfo: {
        answer: "",
      },
      thyroidInfo: {
        answer: "",
        which: [],
      },
      tuberculosisInfo: {
        answer: "",
      },
    },
    retirementInfo: {
      appliedForRetirement: "",
      reason: "",
      reductionOfEarningCapacity: "",
    },
  };
}
