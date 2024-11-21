/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiSchoolEntryProcedure,
  ApiSchoolEntryProcedureType,
  ApiSchoolEntryStatusType,
} from "@eshg/employee-portal-api/schoolEntry";

import { mapOptional } from "@/lib/shared/api/models/utils";

import { BaseEntity, mapBaseEntity } from "./BaseEntity";
import { Label, mapLabels } from "./Label";
import { Location, mapLocation } from "./Location";
import { Person, mapPerson } from "./Person";

export interface Procedure extends BaseEntity {
  readonly type: ApiSchoolEntryProcedureType;
  readonly child: Person;
  readonly school?: Location;
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
    school: mapOptional(response.school, mapLocation),
    labels: mapLabels(response.labels),
    status: response.status,
    appointmentStart: response.appointmentStart,
    createdAt: response.createdAt,
    modifiedAt: response.modifiedAt,
    isClosed: response.status === ApiSchoolEntryStatusType.Closed,
    schoolYear: response.schoolYear,
  };
}
