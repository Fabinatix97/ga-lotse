/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { mapPaginatedList } from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal";
import { GetAppointmentBlockGroupsRequest } from "@eshg/measles-protection-api";

import { useAppointmentBlockApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { mapAppointmentBlockGroup } from "@/lib/businessModules/measlesProtection/api/models/AppointmentBlockGroup";

import { appointmentBlockApiQueryKey } from "./apiQueryKeys";

export function useGetAppointmentBlockGroupsOptions(
  request: GetAppointmentBlockGroupsRequest,
) {
  const appointmentBlockApi = useAppointmentBlockApi();
  return queryOptions({
    queryKey: appointmentBlockApiQueryKey([
      "getAppointmentBlockGroups",
      request,
    ]),
    queryFn: () =>
      appointmentBlockApi
        .getAppointmentBlockGroupsRaw(request)
        .then(unwrapRawResponse),
    select: mapPaginatedList(mapAppointmentBlockGroup),
  });
}
