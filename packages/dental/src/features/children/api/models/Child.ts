/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiChild, ApiGender, ApiProcedureStatus } from "@eshg/dental-api";
import { BaseEntity, mapBaseEntity } from "@eshg/lib-employee-portal";

import { Institution, mapInstitution } from "@/api/models/Institution";

export interface Child extends BaseEntity {
  readonly firstName: string;
  readonly lastName: string;
  readonly gender: ApiGender;
  readonly dateOfBirth: Date;
  readonly year: number;
  readonly groupName: string;
  readonly institution: Institution;
  readonly isClosed: boolean;
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
    isClosed: response.status == ApiProcedureStatus.Closed,
  };
}
