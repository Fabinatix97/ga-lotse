/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetAppointmentBlockAvailabilityResponse } from "@eshg/prostitute-protection-api";

import {
  AppointmentBlockAvailabilityFormModel,
  AppointmentBlockDefaultAvailabilityForm,
  FormNames,
} from "@/lib/configurator/components/shared/ConfiguratorDetails/appointmentDefaultAvailability/AppointmentBlockDefaultAvailability";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useProstituteProtectionAppointmentBlockAvailabilityApi } from "@/lib/shared/api/clients";
import { useUpdateAppointmentBlockAvailability } from "@/lib/shared/api/mutations/configurator/useUpdateAppointmentBlockAvailability";
import { useGetAppointmentDefaultAvailability } from "@/lib/shared/api/queries/configurator/appointmentBlockDefaultAvailability";

export function ProstituteProtectionAppointmentBlockAvailability() {
  function useGetProstituteProtectionAppointmentBlockAvailability() {
    return useGetAppointmentDefaultAvailability(
      ConfiguratorModuleName.ProstituteProtection,
      useProstituteProtectionAppointmentBlockAvailabilityApi,
      mapResponse,
    );
  }

  function useUpdateProstituteProtectionAppointmentBlockAvailability() {
    return useUpdateAppointmentBlockAvailability(
      useProstituteProtectionAppointmentBlockAvailabilityApi,
    );
  }

  return (
    <AppointmentBlockDefaultAvailabilityForm
      moduleName={ConfiguratorModuleName.ProstituteProtection}
      fields={[
        FormNames.AVAILABLE_FOR_CITIZEN,
        FormNames.CITIZEN_MIN_LEAD_TIME,
        FormNames.CITIZEN_MAX_LEAD_TIME,
      ]}
      queryHook={useGetProstituteProtectionAppointmentBlockAvailability}
      updateHook={useUpdateProstituteProtectionAppointmentBlockAvailability}
    />
  );
}

function mapResponse(
  response: ApiGetAppointmentBlockAvailabilityResponse,
): AppointmentBlockAvailabilityFormModel {
  return {
    availableForCitizen: response.defaultFlags?.availableForCitizen ?? false,
    availableForBulkBooking:
      response.defaultFlags?.availableForBulkBooking ?? false,
    bulkCreateAppointmentsMinLeadTime:
      response.leadTimes?.bulkCreateAppointmentsMinLeadTime ?? 0,
    citizenFreeAppointmentsMinLeadTime:
      response.leadTimes?.citizenFreeAppointmentsMinLeadTime ?? "",
    citizenFreeAppointmentsMaxLeadTime:
      response.leadTimes?.citizenFreeAppointmentsMaxLeadTime ?? "",
  };
}
