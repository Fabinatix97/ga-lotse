/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

import { OptionalFieldValue } from "@eshg/lib-portal";
import { ApiGetMeaslesProtectionAppointmentStandardDurationsResponse } from "@eshg/measles-protection-api";

import {
  mapDurationValue,
  useUpdateAppointmentStandardDuration,
} from "@/lib/configurator/api/mutations/useUpdateAppointmentStandardDuration";
import {
  mapOptionalISODuration,
  useGetAppointmentStandardDurations,
} from "@/lib/configurator/api/queries/appointment";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useMeaslesProtectionAppointmentStandardDurationConfigApi } from "@/lib/shared/api/clients";

import {
  AppointmentStandardDurationConfiguratorForm,
  StandardDurationField,
} from "./AppointmentStandardDuration";

export const MEASLES_PROTECTION_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME =
  "MEASLES_PROTECTION_APPOINTMENT_STANDARD_DURATION";

export function MeaslesProtectionAppointmentStandardDuration() {
  return (
    <AppointmentStandardDurationConfiguratorForm
      moduleName={ConfiguratorModuleName.MeaslesProtection}
      endpointName={
        MEASLES_PROTECTION_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME
      }
      fields={fields}
      queryHook={useGetMeaslesProtectionStandardDurationsConfig}
      updateHook={useUpdateMeaslesProtectionAppointmentStandardDuration}
    />
  );
}

enum FormNames {
  PROOF_SUBMISSION = "proofSubmission",
}

interface MeaslesProtectionAppointmentStandardDurationFormValues extends FormikValues {
  [FormNames.PROOF_SUBMISSION]: OptionalFieldValue<number>;
}

const fields: StandardDurationField<MeaslesProtectionAppointmentStandardDurationFormValues>[] =
  [
    {
      name: FormNames.PROOF_SUBMISSION,
      label: "Termindauer Nachweisvorlage in Minuten",
    },
  ];

function mapValues(
  values: MeaslesProtectionAppointmentStandardDurationFormValues,
) {
  return {
    proofSubmission: mapDurationValue(values.proofSubmission),
  };
}

function useUpdateMeaslesProtectionAppointmentStandardDuration() {
  return useUpdateAppointmentStandardDuration(
    useMeaslesProtectionAppointmentStandardDurationConfigApi,
    mapValues,
  );
}

function mapResponse(
  data: ApiGetMeaslesProtectionAppointmentStandardDurationsResponse,
): MeaslesProtectionAppointmentStandardDurationFormValues {
  const { standardDurations } = data;
  return {
    proofSubmission: mapOptionalISODuration(standardDurations?.proofSubmission),
  };
}

function useGetMeaslesProtectionStandardDurationsConfig() {
  return useGetAppointmentStandardDurations(
    ConfiguratorModuleName.MeaslesProtection,
    useMeaslesProtectionAppointmentStandardDurationConfigApi,
    mapResponse,
  );
}
