/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppointmentBlockApi as Api } from "@eshg/lib-employee-portal";
import {
  AppointmentBlockApi,
  DeleteAppointmentBlockRequest,
  UpdateAppointmentBlockRequest,
  ValidateUpdateAppointmentBlockRequest,
} from "@eshg/sti-protection-api";

import { mapApiAppointmentBlock } from "@/lib/businessModules/stiProtection/api/models/AppointmentBlockGroup";

export function mapAppointmentBlockApi(
  appointmentBlockApi: AppointmentBlockApi,
): Api {
  return {
    getAppointmentBlock: async (appointmentBlockId: string) => {
      const appointmentBlock =
        await appointmentBlockApi.getAppointmentBlock(appointmentBlockId);
      return mapApiAppointmentBlock(appointmentBlock);
    },
    updateAppointmentBlock: async (
      requestParameters: UpdateAppointmentBlockRequest,
    ) => await appointmentBlockApi.updateAppointmentBlockRaw(requestParameters),
    validateUpdateAppointmentBlock: async (
      requestParameters: ValidateUpdateAppointmentBlockRequest,
    ) =>
      await appointmentBlockApi.validateUpdateAppointmentBlockRaw(
        requestParameters,
      ),
    deleteAppointmentBlock: async (
      requestParameters: DeleteAppointmentBlockRequest,
    ) => await appointmentBlockApi.deleteAppointmentBlockRaw(requestParameters),
  };
}
