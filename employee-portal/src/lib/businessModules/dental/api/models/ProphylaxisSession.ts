/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiProphylaxisSession,
  ApiProphylaxisType,
} from "@eshg/employee-portal-api/dental";

import { BaseEntity } from "@/lib/shared/api/models/BaseEntity";

import { Institution, mapInstitution } from "./Institution";

export interface ProphylaxisSession extends BaseEntity {
  dateAndTime: Date;
  institution: Institution;
  groupName: string;
  type: ApiProphylaxisType;
}

export function mapProphylaxisSession(
  response: ApiProphylaxisSession,
): ProphylaxisSession {
  return {
    ...response,
    institution: mapInstitution(response.institution),
  };
}
