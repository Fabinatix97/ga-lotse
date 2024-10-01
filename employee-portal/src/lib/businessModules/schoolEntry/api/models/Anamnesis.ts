/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAdditionalChildInfo,
  ApiAnamnesis,
  ApiCheckUps,
  ApiDaycareAndSchoolInfo,
  ApiDevelopmentInfo,
  ApiFamilyHistoryInfo,
  ApiIllnessAndAccidentInfo,
  ApiInterestsAndSportsInfo,
  ApiMigrationBackground,
  ApiPromotionBeforeSchoolEntry,
  ApiPromotionTherapyAndAidInfo,
} from "@eshg/employee-portal-api/schoolEntry";

import {
  Versioned,
  mapVersioned,
} from "@/lib/businessModules/schoolEntry/api/models/Versioned";

export interface Anamnesis extends Versioned {
  childLanguageScreening?: boolean;
  preliminaryCourse?: boolean;
  additionalChildInfo: ApiAdditionalChildInfo;
  daycareAndSchoolInfo: ApiDaycareAndSchoolInfo;
  developmentInfo: ApiDevelopmentInfo;
  checkUps: ApiCheckUps;
  familyHistoryInfo: ApiFamilyHistoryInfo;
  illnessAndAccidentInfo: ApiIllnessAndAccidentInfo;
  promotionBeforeSchoolEntry: ApiPromotionBeforeSchoolEntry;
  promotionTherapyAndAidInfo: ApiPromotionTherapyAndAidInfo;
  interestsAndSportsInfo: ApiInterestsAndSportsInfo;
  migrationBackground: ApiMigrationBackground;
  personalConspicuities?: boolean;
}

export function mapAnamnesis(response: ApiAnamnesis): Anamnesis {
  return {
    childLanguageScreening: response.childLanguageScreening,
    ...mapVersioned(response),
    preliminaryCourse: response.preliminaryCourse,
    additionalChildInfo: response.additionalChildInfo,
    daycareAndSchoolInfo: response.daycareAndSchoolInfo,
    developmentInfo: response.developmentInfo,
    checkUps: response.checkUps,
    familyHistoryInfo: response.familyHistoryInfo,
    illnessAndAccidentInfo: response.illnessAndAccidentInfo,
    promotionBeforeSchoolEntry: response.promotionBeforeSchoolEntry,
    promotionTherapyAndAidInfo: response.promotionTherapyAndAidInfo,
    interestsAndSportsInfo: response.interestsAndSportsInfo,
    migrationBackground: response.migrationBackground,
    personalConspicuities: response.personalConspicuities,
  };
}
