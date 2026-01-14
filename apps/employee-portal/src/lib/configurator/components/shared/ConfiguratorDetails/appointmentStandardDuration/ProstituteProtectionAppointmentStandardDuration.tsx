/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

import { OptionalFieldValue } from "@eshg/lib-portal";
import { ApiGetProstituteProtectionAppointmentStandardDurationsResponse } from "@eshg/prostitute-protection-api";

import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useProstituteProtectionAppointmentStandardDurationConfigApi } from "@/lib/shared/api/clients";
import {
  mapDurationValue,
  useUpdateAppointmentStandardDuration,
} from "@/lib/shared/api/mutations/configurator/useUpdateAppointmentStandardDuration";
import {
  mapOptionalISODuration,
  useGetAppointmentStandardDurations,
} from "@/lib/shared/api/queries/configurator/appointment";

import {
  AppointmentStandardDurationConfiguratorForm,
  StandardDurationField,
} from "./AppointmentStandardDuration";

export const PROSTITUTE_PROTECTION_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME =
  "PROSTITUTE_PROTECTION_APPOINTMENT_STANDARD_DURATION";

export function ProstituteProtectionAppointmentStandardDuration() {
  return (
    <AppointmentStandardDurationConfiguratorForm
      moduleName={ConfiguratorModuleName.ProstituteProtection}
      endpointName={
        PROSTITUTE_PROTECTION_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME
      }
      fields={fields}
      queryHook={useGetProstituteProtectionStandardDurations}
      updateHook={useUpdateProstituteProtectionAppointmentStandardDuration}
    />
  );
}

enum FormNames {
  CONSULTATION = "consultation",
}

interface ProstituteProtectionAppointmentStandardDurationFormValues
  extends FormikValues {
  [FormNames.CONSULTATION]: OptionalFieldValue<number>;
}

const fields: StandardDurationField<ProstituteProtectionAppointmentStandardDurationFormValues>[] =
  [
    {
      name: FormNames.CONSULTATION,
      label: "Termindauer Beratung in Minuten",
    },
  ];

function mapValues(
  values: ProstituteProtectionAppointmentStandardDurationFormValues,
) {
  return {
    consultation: mapDurationValue(values.consultation),
  };
}

function useUpdateProstituteProtectionAppointmentStandardDuration() {
  return useUpdateAppointmentStandardDuration(
    useProstituteProtectionAppointmentStandardDurationConfigApi,
    mapValues,
  );
}

function mapResponse(
  data: ApiGetProstituteProtectionAppointmentStandardDurationsResponse,
): ProstituteProtectionAppointmentStandardDurationFormValues {
  const { standardDurations } = data;
  return {
    consultation: mapOptionalISODuration(standardDurations?.consultation),
  };
}

function useGetProstituteProtectionStandardDurations() {
  return useGetAppointmentStandardDurations(
    ConfiguratorModuleName.ProstituteProtection,
    useProstituteProtectionAppointmentStandardDurationConfigApi,
    mapResponse,
  );
}
