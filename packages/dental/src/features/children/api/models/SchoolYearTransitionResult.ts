/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiInstitutionForTransition,
  ApiSchoolYearTransitionStatus,
} from "@eshg/dental-api";

import {
  InstitutionWithAddress,
  mapInstitutionWithAddress,
} from "../../../../api/models/InstitutionWithAddress";

export interface InstitutionForTransition {
  readonly institution: InstitutionWithAddress;
  readonly completedCount: number;
  readonly totalCount: number;
  readonly status: ApiSchoolYearTransitionStatus;
}

export function mapInstitutionResult(
  response: ApiInstitutionForTransition,
): InstitutionForTransition {
  return {
    institution: mapInstitutionWithAddress(response.institution),
    completedCount: response.completedCount,
    totalCount: response.totalCount,
    status: response.status,
  };
}
