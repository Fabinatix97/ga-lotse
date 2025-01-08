/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCreateDailyAppointmentBlockGroupRequest,
  GetAppointmentBlockGroupsRequest,
} from "@eshg/employee-portal-api/officialMedicalService";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { useAppointmentBlockApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { mapAppointmentBlockGroup } from "@/lib/businessModules/officialMedicalService/api/models/AppointmentBlockGroup";
import { appointmentBlockApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";
import { mapPaginatedList } from "@/lib/shared/api/models/PaginatedList";

export function useGetAppointmentBlockGroupsQuery(
  request: GetAppointmentBlockGroupsRequest,
) {
  const appointmentApi = useAppointmentBlockApi();
  return queryOptions({
    queryKey: appointmentBlockApiQueryKey([
      "getAppointmentBlockGroups",
      request,
    ]),
    queryFn: () =>
      appointmentApi
        .getAppointmentBlockGroupsRaw(request)
        .then(unwrapRawResponse),
    select: mapPaginatedList(mapAppointmentBlockGroup),
  });
}

export function useValidateDailyAppointmentBlocksForGroup(
  data: ApiCreateDailyAppointmentBlockGroupRequest | null,
) {
  const appointmentApi = useAppointmentBlockApi();
  return useQuery({
    queryKey: appointmentBlockApiQueryKey([
      "validateDailyAppointmentBlocksForGroup",
      data,
    ]),
    queryFn: () =>
      data != null
        ? appointmentApi.validateDailyAppointmentBlocksForGroup(data)
        : null,
  });
}
