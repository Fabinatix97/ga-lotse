/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAnnualInstitution } from "@eshg/dental-api";

import { Institution, mapInstitution } from "./Institution";

export interface AnnualInstitution {
  readonly institution: Institution;
  readonly groupName?: string;
  readonly year: number;
}

export function mapAnnualInstitution(
  response: ApiAnnualInstitution,
): AnnualInstitution {
  return {
    institution: mapInstitution(response.institution),
    groupName: response.group,
    year: response.year,
  };
}
