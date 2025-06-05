/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { mapToObj } from "remeda";

import { unwrapRawResponse } from "@eshg/lib-portal";

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
