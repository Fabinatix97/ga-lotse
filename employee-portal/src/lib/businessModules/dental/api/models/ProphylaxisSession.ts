/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiFluoridationVarnish,
  ApiProphylaxisSession,
  ApiProphylaxisType,
} from "@eshg/dental-api";

import { BaseEntity } from "@/lib/shared/api/models/BaseEntity";

import { Institution, mapInstitution } from "./Institution";

export interface ProphylaxisSession extends BaseEntity {
  dateAndTime: Date;
  institution: Institution;
  groupName: string;
  type: ApiProphylaxisType;
  screening: boolean;
  fluoridationVarnish?: ApiFluoridationVarnish;
}

export function mapProphylaxisSession(
  response: ApiProphylaxisSession,
): ProphylaxisSession {
  return {
    ...response,
    institution: mapInstitution(response.institution),
  };
}
