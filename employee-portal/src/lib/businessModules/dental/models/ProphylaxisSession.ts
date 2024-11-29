/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProphylaxisSession } from "@eshg/employee-portal-api/dental";

import {
  Institution,
  mapInstitution,
} from "@/lib/businessModules/dental/models/Institution";
import { BaseEntity } from "@/lib/shared/api/models/BaseEntity";

export interface ProphylaxisSession extends BaseEntity {
  dateAndTime: Date;
  institution: Institution;
}

export function mapProphylaxisSession(
  response: ApiProphylaxisSession,
): ProphylaxisSession {
  return {
    ...response,
    institution: mapInstitution(response.institution),
  };
}
