/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAppointmentBookingApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { appointmentBookingApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";

export function useGetFreeAppointments({ enabled }: { enabled: boolean }) {
  const appointmentBookingApi = useAppointmentBookingApi();
  return useQuery({
    queryKey: appointmentBookingApiQueryKey(["freeAppointments"]),
    queryFn: () => appointmentBookingApi.getFreeMeaslesProtectionAppointments(),
    placeholderData: keepPreviousData,
    select: (response) => response.appointments,
    enabled,
  });
}
