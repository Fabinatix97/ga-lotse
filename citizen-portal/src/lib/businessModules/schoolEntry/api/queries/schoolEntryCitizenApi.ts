/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SchoolEntryCitizenApi } from "@eshg/school-entry-api";
import { queryOptions } from "@tanstack/react-query";

import { mapAppointment } from "@/lib/businessModules/schoolEntry/api/models/Appointment";
import { mapSchoolEntryProcedure } from "@/lib/businessModules/schoolEntry/api/models/SchoolEntryProcedure";
import { schoolEntryCitizenApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

export function getSelfProcedureAsCitizenQuery(
  schoolEntryCitizenApi: SchoolEntryCitizenApi,
) {
  return queryOptions({
    queryKey: schoolEntryCitizenApiQueryKey(["getSelfProcedureAsCitizen"]),
    queryFn: () => schoolEntryCitizenApi.getSelfProcedureAsCitizen(),
    select: mapSchoolEntryProcedure,
  });
}

export function getSelfFreeAppointmentsAsCitizenQuery(
  schoolEntryCitizenApi: SchoolEntryCitizenApi,
) {
  return queryOptions({
    queryKey: schoolEntryCitizenApiQueryKey([
      "getSelfFreeAppointmentsAsCitizen",
    ]),
    queryFn: () => schoolEntryCitizenApi.getSelfFreeAppointmentsAsCitizen(),
    select: (response) => response.freeAppointments.map(mapAppointment),
  });
}
