/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCitizenChild } from "@eshg/school-entry-api";

export interface SchoolEntryChild {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}

export function mapSchoolEntryChild(
  response: ApiCitizenChild,
): SchoolEntryChild {
  return {
    firstName: response.firstName,
    lastName: response.lastName,
    dateOfBirth: response.dateOfBirth,
  };
}
