/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiSchool,
  ApiSchoolEntryProcedure,
  ApiSchoolEntryProcedureType,
  ApiSchoolEntryStatusType,
} from "@eshg/employee-portal-api/schoolEntry";
import { parseOptionalValue } from "@eshg/lib-portal/helpers/form";

import {
  Label,
  mapLabels,
} from "@/lib/businessModules/schoolEntry/api/models/Label";

import { BaseEntity, mapBaseEntity } from "./BaseEntity";
import { Person, mapPerson } from "./Person";

export interface School {
  readonly id: string;
  readonly name: string;
}

export interface Procedure extends BaseEntity {
  readonly type: ApiSchoolEntryProcedureType;
  readonly child: Person;
  readonly school: School;
  readonly labels: Label[];
  readonly status: ApiSchoolEntryStatusType;
  readonly appointmentStart?: Date;
  readonly createdAt: Date;
  readonly modifiedAt: Date;
  readonly isClosed: boolean;
  readonly schoolYear?: number;
}

export function mapProcedure(response: ApiSchoolEntryProcedure): Procedure {
  return {
    ...mapBaseEntity(response),
    type: response.type,
    child: mapPerson(response.child),
    school: mapSchool(response.school),
    labels: mapLabels(response.labels),
    status: response.status,
    appointmentStart: response.appointmentStart,
    createdAt: response.createdAt,
    modifiedAt: response.modifiedAt,
    isClosed: response.status === ApiSchoolEntryStatusType.Closed,
    schoolYear: response.schoolYear,
  };
}

function mapSchool(school?: ApiSchool): School {
  return {
    id: parseOptionalValue(school?.id),
    name: parseOptionalValue(school?.name),
  };
}
