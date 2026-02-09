/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  mapRequiredValue,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";

import { AppointmentBlockAvailabilityFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/appointmentDefaultAvailability/AppointmentBlockDefaultAvailability";

interface UpdateAppointmentBlockAvailabilityRequest {
  defaultFlags?: {
    availableForBulkBooking: boolean;
    availableForCitizen: boolean;
  };
  leadTimes?: {
    bulkCreateAppointmentsMinLeadTime: number;
    citizenFreeAppointmentsMaxLeadTime: number;
    citizenFreeAppointmentsMinLeadTime: number;
  };
}

export function useUpdateAppointmentBlockAvailability(
  apiHook: () => {
    updateAvailability: (
      payload: UpdateAppointmentBlockAvailabilityRequest,
    ) => Promise<void>;
  },
) {
  const api = apiHook();
  const snackbar = useSnackbar();

  const mutation = useHandledMutation({
    mutationFn: (params: AppointmentBlockAvailabilityFormModel) =>
      api.updateAvailability(mapValues(params)),
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return (model: AppointmentBlockAvailabilityFormModel) =>
    mutation.mutateAsync(model);
}

export function mapValues(
  values: AppointmentBlockAvailabilityFormModel,
): UpdateAppointmentBlockAvailabilityRequest {
  return {
    defaultFlags: {
      availableForCitizen: values.availableForCitizen,
      availableForBulkBooking: values.availableForBulkBooking,
    },
    leadTimes: {
      bulkCreateAppointmentsMinLeadTime: mapRequiredValue(
        values.bulkCreateAppointmentsMinLeadTime,
      ),
      citizenFreeAppointmentsMinLeadTime: mapRequiredValue(
        values.citizenFreeAppointmentsMinLeadTime,
      ),
      citizenFreeAppointmentsMaxLeadTime: mapRequiredValue(
        values.citizenFreeAppointmentsMaxLeadTime,
      ),
    },
  };
}
