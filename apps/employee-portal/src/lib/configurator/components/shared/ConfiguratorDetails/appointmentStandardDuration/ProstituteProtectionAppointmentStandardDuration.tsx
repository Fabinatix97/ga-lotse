/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

import { OptionalFieldValue } from "@eshg/lib-portal";
import { ApiGetProstituteProtectionAppointmentStandardDurationsResponse } from "@eshg/prostitute-protection-api";

import {
  mapDurationValue,
  useUpdateAppointmentStandardDuration,
} from "@/lib/configurator/api/mutations/useUpdateAppointmentStandardDuration";
import {
  mapOptionalISODuration,
  useGetAppointmentStandardDurations,
} from "@/lib/configurator/api/queries/appointment";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useProstituteProtectionAppointmentStandardDurationConfigApi } from "@/lib/shared/api/clients";

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
  INITIAL_CONSULTATION = "initialConsultation",
  FOLLOW_UP_CONSULTATION = "followUpConsultation",
}

interface ProstituteProtectionAppointmentStandardDurationFormValues extends FormikValues {
  [FormNames.INITIAL_CONSULTATION]: OptionalFieldValue<number>;
  [FormNames.FOLLOW_UP_CONSULTATION]: OptionalFieldValue<number>;
}

const fields: StandardDurationField<ProstituteProtectionAppointmentStandardDurationFormValues>[] =
  [
    {
      name: FormNames.INITIAL_CONSULTATION,
      label: "Termindauer Erstberatung in Minuten",
    },
    {
      name: FormNames.FOLLOW_UP_CONSULTATION,
      label: "Termindauer Folgeberatung in Minuten",
    },
  ];

function mapValues(
  values: ProstituteProtectionAppointmentStandardDurationFormValues,
) {
  return {
    initialConsultation: mapDurationValue(
      values[FormNames.INITIAL_CONSULTATION],
    ),
    followUpConsultation: mapDurationValue(
      values[FormNames.FOLLOW_UP_CONSULTATION],
    ),
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
    initialConsultation: mapOptionalISODuration(
      standardDurations?.initialConsultation,
    ),
    followUpConsultation: mapOptionalISODuration(
      standardDurations?.followUpConsultation,
    ),
  };
}

function useGetProstituteProtectionStandardDurations() {
  return useGetAppointmentStandardDurations(
    ConfiguratorModuleName.ProstituteProtection,
    useProstituteProtectionAppointmentStandardDurationConfigApi,
    mapResponse,
  );
}
