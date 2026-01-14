/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  type ApiBooleanWithUnknown,
  ApiChild,
  ApiGender,
  ApiProcedureStatus,
} from "@eshg/dental-api";
import {
  BaseEntity,
  ProcedureLabel,
  mapBaseEntity,
  mapProcedureLabels,
} from "@eshg/lib-employee-portal";

import {
  Institution,
  mapInstitution,
} from "../../../../api/models/Institution";

export interface Child extends BaseEntity {
  readonly firstName: string;
  readonly lastName: string;
  readonly gender: ApiGender;
  readonly dateOfBirth: Date;
  readonly year: number;
  readonly groupName?: string;
  readonly institution: Institution;
  readonly isClosed: boolean;
  readonly procedureLabels: ProcedureLabel[];
  readonly fluoridationConsent: ApiBooleanWithUnknown;
}

export function mapChild(response: ApiChild): Child {
  return {
    ...mapBaseEntity(response),
    firstName: response.firstName,
    lastName: response.lastName,
    gender: response.gender,
    dateOfBirth: response.dateOfBirth,
    year: response.year,
    groupName: response.groupName,
    institution: mapInstitution(response.institution),
    isClosed: response.status === ApiProcedureStatus.Closed,
    procedureLabels: mapProcedureLabels(response.procedureLabels),
    fluoridationConsent: response.fluoridationConsent,
  };
}
