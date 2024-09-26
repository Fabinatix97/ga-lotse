/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";
import { mapToObj } from "remeda";

import { useAppointmentTypeApi } from "@/lib/businessModules/measlesProtection/api/clients";

import { appointmentTypeApiQueryKey } from "./apiQueryKeys";

export function useGetAppointmentDurations() {
  const appointmentTypeApi = useAppointmentTypeApi();

  return useSuspenseQuery({
    queryKey: appointmentTypeApiQueryKey(["getAppointmentTypes"]),
    queryFn: () =>
      appointmentTypeApi.getAppointmentTypesRaw().then(unwrapRawResponse),
    select: (response) =>
      mapToObj(response.appointmentTypeConfigDtos, (configDto) => [
        configDto.appointmentTypeDto,
        configDto.standardDurationInMinutes,
      ]),
  });
}
