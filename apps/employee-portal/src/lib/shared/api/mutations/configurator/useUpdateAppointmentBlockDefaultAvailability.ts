/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { SchoolEntryAppointmentBlockDefaultAvailabilityFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/SchoolEntryAppointmentBlockDefaultAvailability";
import { useSchoolEntryAppointmentBlockDefaultAvailabilityApi } from "@/lib/shared/api/clients";

export function useUpdateAppointmentBlockDefaultAvailability() {
  const snackbar = useSnackbar();
  const configuratorApi =
    useSchoolEntryAppointmentBlockDefaultAvailabilityApi();

  const { mutateAsync } = useHandledMutation({
    mutationFn: (
      params: SchoolEntryAppointmentBlockDefaultAvailabilityFormModel,
    ) => configuratorApi.updateDefaultFlags(params),
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return mutateAsync;
}
