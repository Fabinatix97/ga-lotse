/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseEntity,
  ProcedureLabel,
  Versioned,
  mapBaseEntity,
  mapOptional,
  mapProcedureLabels,
  mapVersioned,
} from "@eshg/lib-employee-portal";
import {
  ApiSchoolEntryProcedure,
  ApiSchoolEntryProcedureType,
  ApiSchoolEntryStatusType,
} from "@eshg/school-entry-api";

import { Location, mapLocation } from "./Location";
import { Person, mapPerson } from "./Person";

export interface Procedure extends BaseEntity, Versioned {
  readonly type: ApiSchoolEntryProcedureType;
  readonly child: Person;
  readonly school?: Location;
  readonly labels: ProcedureLabel[];
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
    ...mapVersioned(response),
    type: response.type,
    child: mapPerson(response.child),
    school: mapOptional(response.school, mapLocation),
    labels: mapProcedureLabels(response.labels),
    status: response.status,
    appointmentStart: response.appointmentStart,
    createdAt: response.createdAt,
    modifiedAt: response.modifiedAt,
    isClosed: response.status === ApiSchoolEntryStatusType.Closed,
    schoolYear: response.schoolYear,
  };
}
