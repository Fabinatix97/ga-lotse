/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiFluoridationVarnish,
  ApiProphylaxisSession,
  ApiProphylaxisStatus,
  ApiProphylaxisType,
} from "@eshg/dental-api";
import { BaseEntity, mapBaseEntity } from "@eshg/lib-employee-portal";

import {
  Institution,
  mapInstitution,
} from "../../../../api/models/Institution";

export interface ProphylaxisSession extends BaseEntity {
  dateAndTime: Date;
  institution: Institution;
  groupName?: string;
  type?: ApiProphylaxisType;
  isScreening: boolean;
  fluoridationVarnish?: ApiFluoridationVarnish;
  status: ApiProphylaxisStatus;
}

export function mapProphylaxisSession(
  response: ApiProphylaxisSession,
): ProphylaxisSession {
  return {
    ...mapBaseEntity(response),
    dateAndTime: response.dateAndTime,
    institution: mapInstitution(response.institution),
    groupName: response.groupName,
    type: response.type,
    isScreening: response.isScreening,
    fluoridationVarnish: response.fluoridationVarnish,
    status: response.status,
  };
}
