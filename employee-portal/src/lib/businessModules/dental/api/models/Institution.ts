/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAnnualInstitution,
  ApiInstitution,
} from "@eshg/employee-portal-api/dental";

import { BaseEntity, mapBaseEntity } from "@/lib/shared/api/models/BaseEntity";

export interface Institution extends BaseEntity {
  readonly name: string;
  readonly hexColor: string;
}

export function mapInstitution(response: ApiInstitution): Institution {
  return {
    ...mapBaseEntity(response),
    name: response.name,
    hexColor: response.hexColor,
  };
}

export interface AnnualInstitution {
  readonly institution: ApiInstitution;
  readonly groupName: string;
  readonly year: number;
}

export function mapAnnualInstitutionDetails(
  response: ApiAnnualInstitution,
): AnnualInstitution {
  return {
    institution: mapInstitution(response.institution),
    groupName: response.group,
    year: response.year,
  };
}
