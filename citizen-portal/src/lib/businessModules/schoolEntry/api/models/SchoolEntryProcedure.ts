/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetCitizenProcedureResponse } from "@eshg/citizen-portal-api/schoolEntry";
import { Duration, intervalToDuration } from "date-fns";

import { SchoolEntryChild, mapSchoolEntryChild } from "./SchoolEntryChild";

export interface SchoolEntryProcedure {
  appointmentStart: Date;
  appointmentDuration: Duration;
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
    child: mapSchoolEntryChild(response.child),
    allowCitizenAnamnesis: response.allowCitizenAnamnesis,
    appointmentChangesByCitizenLeft: response.appointmentChangesByCitizenLeft,
    isClosedProcedure: response.isClosedProcedure,
  };
}
