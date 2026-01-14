/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import { ApiUpdateAppointmentBlockAvailabilityRequest } from "@eshg/school-entry-api";

import { useSchoolEntryAppointmentBlockAvailabilityApi } from "@/lib/shared/api/clients";

export function useUpdateAppointmentBlockAvailability() {
  const snackbar = useSnackbar();
  const configuratorApi = useSchoolEntryAppointmentBlockAvailabilityApi();

  return useHandledMutation({
    mutationFn: (request: ApiUpdateAppointmentBlockAvailabilityRequest) =>
      configuratorApi.updateAvailability(request),
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });
}
