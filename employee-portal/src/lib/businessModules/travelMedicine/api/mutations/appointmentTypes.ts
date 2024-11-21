/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUpdateAppointmentTypeRequest } from "@eshg/employee-portal-api/travelMedicine";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useAppointmentTypeApi } from "@/lib/businessModules/travelMedicine/api/clients";

export interface ApiUpdateAppointmentTypeRequestWrapper {
  request: ApiUpdateAppointmentTypeRequest;
  id: string;
}

export function useUpdateAppointmentType() {
  const snackbar = useSnackbar();
  const appointmentTypeApi = useAppointmentTypeApi();
  return useHandledMutation({
    mutationFn: (wrapper: ApiUpdateAppointmentTypeRequestWrapper) =>
      appointmentTypeApi.updateAppointmentType(wrapper.id, wrapper.request),
    onSuccess: () => {
      snackbar.confirmation("Der Termintyp wurde gespeichert.");
    },
  });
}
