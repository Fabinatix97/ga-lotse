/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Versioned,
  mapVersioned,
} from "@eshg/lib-employee-portal/api/models/Versioned";
import {
  ApiGetDevelopmentScreeningResult,
  ApiHandicap,
  ApiMeasurements,
  ApiPhysicalExamination,
  ApiPsychoSocialRisk,
  ApiSchoolFeedback,
  ApiSchoolRecommendation,
  ApiSocioEducationalPerformance,
} from "@eshg/school-entry-api";

import { Percentiles, mapPercentiles } from "./Percentiles";

export interface DevelopmentScreeningResult extends Versioned {
  percentiles: Percentiles;
  measurements: ApiMeasurements;
  physicalExamination: ApiPhysicalExamination;
  handicap: ApiHandicap;
  psychoSocialRisk: ApiPsychoSocialRisk;
  socioEducationalPerformance: ApiSocioEducationalPerformance;
  schoolRecommendation?: ApiSchoolRecommendation;
  extraEffort?: boolean;
  schoolFeedback?: ApiSchoolFeedback;
}

export function mapDevelopmentScreeningResult(
  response: ApiGetDevelopmentScreeningResult,
): DevelopmentScreeningResult {
  return {
    ...mapVersioned(response),
    percentiles: mapPercentiles(response.percentiles),
    measurements: response.measurements,
    physicalExamination: response.physicalExamination,
    handicap: response.handicap,
    psychoSocialRisk: response.psychoSocialRisk,
    socioEducationalPerformance: response.socioEducationalPerformance,
    schoolRecommendation: response.schoolRecommendation,
    extraEffort: response.extraEffort,
    schoolFeedback: response.schoolFeedback,
  };
}
