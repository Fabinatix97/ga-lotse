/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetAppointmentBlockAvailabilityResponse } from "@eshg/school-entry-api";

import { useUpdateAppointmentBlockAvailability } from "@/lib/configurator/api/mutations/useUpdateAppointmentBlockAvailability";
import { useGetAppointmentDefaultAvailability } from "@/lib/configurator/api/queries/appointmentBlockDefaultAvailability";
import {
  AppointmentBlockAvailabilityFormModel,
  AppointmentBlockDefaultAvailabilityForm,
  FormNames,
} from "@/lib/configurator/components/shared/ConfiguratorDetails/appointmentDefaultAvailability/AppointmentBlockDefaultAvailability";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useSchoolEntryAppointmentBlockAvailabilityApi } from "@/lib/shared/api/clients";

export function SchoolEntryAppointmentBlockAvailability() {
  function useGetSchoolEntryAppointmentBlockAvailability() {
    return useGetAppointmentDefaultAvailability(
      ConfiguratorModuleName.SchoolEntry,
      useSchoolEntryAppointmentBlockAvailabilityApi,
      mapResponse,
    );
  }

  function useUpdateSchoolEntryAppointmentBlockAvailability() {
    return useUpdateAppointmentBlockAvailability(
      useSchoolEntryAppointmentBlockAvailabilityApi,
    );
  }

  return (
    <AppointmentBlockDefaultAvailabilityForm
      moduleName={ConfiguratorModuleName.SchoolEntry}
      fields={Object.values(FormNames)}
      queryHook={useGetSchoolEntryAppointmentBlockAvailability}
      updateHook={useUpdateSchoolEntryAppointmentBlockAvailability}
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
      response.leadTimes?.bulkCreateAppointmentsMinLeadTime ?? "",
    citizenFreeAppointmentsMinLeadTime:
      response.leadTimes?.citizenFreeAppointmentsMinLeadTime ?? "",
    citizenFreeAppointmentsMaxLeadTime:
      response.leadTimes?.citizenFreeAppointmentsMaxLeadTime ?? "",
  };
}
