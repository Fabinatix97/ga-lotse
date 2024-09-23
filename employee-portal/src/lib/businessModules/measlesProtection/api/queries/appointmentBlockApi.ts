/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetAppointmentBlockGroupsRequest } from "@eshg/employee-portal-api/measlesProtection";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useAppointmentBlockApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { mapAppointmentBlockGroup } from "@/lib/businessModules/measlesProtection/api/models/AppointmentBlockGroup";
import { mapPaginatedList } from "@/lib/shared/api/models/PaginatedList";

import { appointmentBlockApiQueryKey } from "./apiQueryKeys";

export function useGetAppointmentBlockGroups(
  request: GetAppointmentBlockGroupsRequest,
) {
  const appointmentBlockApi = useAppointmentBlockApi();
  return useSuspenseQuery({
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
