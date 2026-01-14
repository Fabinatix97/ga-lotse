/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

import { OptionalFieldValue } from "@eshg/lib-portal";
import { ApiGetOmsAppointmentStandardDurationsResponse } from "@eshg/official-medical-service-api";

import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useOmsAppointmentStandardDurationConfigApi } from "@/lib/shared/api/clients";
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

export const OMS_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME =
  "OMS_APPOINTMENT_STANDARD_DURATION";

export function OmsAppointmentStandardDuration() {
  return (
    <AppointmentStandardDurationConfiguratorForm
      moduleName={ConfiguratorModuleName.OfficialMedicalService}
      endpointName={OMS_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME}
      fields={fields}
      queryHook={useGetOmsStandardDurationsConfig}
      updateHook={useUpdateOmsAppointmentStandardDuration}
    />
  );
}

enum FormNames {
  OFFICIAL_MEDICAL_SERVICE_SHORT = "officialMedicalServiceShort",
  OFFICIAL_MEDICAL_SERVICE_LONG = "officialMedicalServiceLong",
}

interface OmsAppointmentStandardDurationFormValues extends FormikValues {
  [FormNames.OFFICIAL_MEDICAL_SERVICE_SHORT]: OptionalFieldValue<number>;
  [FormNames.OFFICIAL_MEDICAL_SERVICE_LONG]: OptionalFieldValue<number>;
}

const fields: StandardDurationField<OmsAppointmentStandardDurationFormValues>[] =
  [
    {
      name: FormNames.OFFICIAL_MEDICAL_SERVICE_SHORT,
      label: "Termindauer Kleine Untersuchung in Minuten",
    },
    {
      name: FormNames.OFFICIAL_MEDICAL_SERVICE_LONG,
      label: "Termindauer Große Untersuchung in Minuten",
    },
  ];

function mapValues(values: OmsAppointmentStandardDurationFormValues) {
  return {
    officialMedicalServiceShort: mapDurationValue(
      values.officialMedicalServiceShort,
    ),
    officialMedicalServiceLong: mapDurationValue(
      values.officialMedicalServiceLong,
    ),
  };
}

function useUpdateOmsAppointmentStandardDuration() {
  return useUpdateAppointmentStandardDuration(
    useOmsAppointmentStandardDurationConfigApi,
    mapValues,
  );
}

function mapResponse(
  data: ApiGetOmsAppointmentStandardDurationsResponse,
): OmsAppointmentStandardDurationFormValues {
  const { standardDurations } = data;
  return {
    officialMedicalServiceShort: mapOptionalISODuration(
      standardDurations?.officialMedicalServiceShort,
    ),
    officialMedicalServiceLong: mapOptionalISODuration(
      standardDurations?.officialMedicalServiceLong,
    ),
  };
}

function useGetOmsStandardDurationsConfig() {
  return useGetAppointmentStandardDurations(
    ConfiguratorModuleName.OfficialMedicalService,
    useOmsAppointmentStandardDurationConfigApi,
    mapResponse,
  );
}
