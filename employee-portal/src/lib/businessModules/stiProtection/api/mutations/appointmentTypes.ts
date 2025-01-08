/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentTypeConfig,
  ApiUpdateAppointmentTypeRequest,
} from "@eshg/employee-portal-api/stiProtection";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";

import { useAppointmentTypeApi } from "@/lib/businessModules/stiProtection/api/clients";

import { MutationPassThrough } from "./types";

export interface UpdateAppointmentTypeRequestArgs {
  request: ApiUpdateAppointmentTypeRequest;
  id: string;
}

export function useUpdateAppointmentType({
  onSuccess,
  onError,
}: MutationPassThrough<
  ApiAppointmentTypeConfig,
  UpdateAppointmentTypeRequestArgs
> = {}) {
  const appointmentTypeApi = useAppointmentTypeApi();
  return useHandledMutation({
    mutationFn: ({ id, request }: UpdateAppointmentTypeRequestArgs) =>
      appointmentTypeApi.updateAppointmentType(id, request),
    onSuccess,
    onError,
  });
}
