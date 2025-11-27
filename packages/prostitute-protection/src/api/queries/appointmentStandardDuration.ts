/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useQuery } from "@tanstack/react-query";

import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";

import { appointmentStandardDurationApiQueryKey } from "./apiQueryKeys";

export function useGetAppointmentStandardDurationOptions() {
  const { appointmentStandardDurationApi } =
    useProstituteProtectionApiClients();
  return queryOptions({
    queryKey: appointmentStandardDurationApiQueryKey(["getStandardDurations"]),
    queryFn: () => appointmentStandardDurationApi.getStandardDurations(),
  });
}

export function useGetAppointmentStandardDuration() {
  const options = useGetAppointmentStandardDurationOptions();
  return useQuery(options);
}
