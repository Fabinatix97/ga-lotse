/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiChild,
  ApiGender,
  ApiInstitution,
  ApiProcedureStatus,
} from "@eshg/employee-portal-api/dental";

import { BaseEntity, mapBaseEntity } from "@/lib/shared/api/models/BaseEntity";

import { mapInstitution } from "./Institution";

export interface Child extends BaseEntity {
  readonly firstName: string;
  readonly lastName: string;
  readonly gender: ApiGender;
  readonly dateOfBirth: Date;
  readonly year: number;
  readonly groupName: string;
  readonly institution: ApiInstitution;
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
