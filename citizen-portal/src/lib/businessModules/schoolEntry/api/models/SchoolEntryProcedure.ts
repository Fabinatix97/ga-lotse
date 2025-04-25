/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Duration, intervalToDuration } from "date-fns";

import { ApiGetCitizenProcedureResponse } from "@eshg/school-entry-api";

import { SchoolEntryChild, mapSchoolEntryChild } from "./SchoolEntryChild";

export interface AppointmentAddress {
  name?: string;
  street: string;
  houseNumber?: string;
  postalCode: string;
  city: string;
}

export interface SchoolEntryProcedure {
  appointmentStart: Date;
  appointmentDuration: Duration;
  appointmentAddress: AppointmentAddress;
  child: SchoolEntryChild;
  allowCitizenAnamnesis: boolean;
  appointmentChangesByCitizenLeft: number;
  isClosedProcedure: boolean;
}

export function mapSchoolEntryProcedure(
  response: ApiGetCitizenProcedureResponse,
): SchoolEntryProcedure {
  return {
    appointmentStart: response.appointmentStart,
    appointmentDuration: intervalToDuration({
      start: response.appointmentStart,
      end: response.appointmentEnd,
    }),
    appointmentAddress: {
      name: response.appointmentAddress.name,
      ...response.appointmentAddress.address,
    },
    child: mapSchoolEntryChild(response.child),
    allowCitizenAnamnesis: response.allowCitizenAnamnesis,
    appointmentChangesByCitizenLeft: response.appointmentChangesByCitizenLeft,
    isClosedProcedure: response.isClosedProcedure,
  };
}
