/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

import { OptionalFieldValue } from "@eshg/lib-portal";
import {
  ApiGetHivStiConsultationAppointmentStandardDurationsResponse,
  ApiHivStiConsultationAppointmentStandardDurations,
} from "@eshg/sti-protection-api";

import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useStiProtectionAppointmentStandardDurationConfigApi } from "@/lib/shared/api/clients";
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

export const STI_PROTECTION_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME =
  "HIV_STI_CONSULTATION_APPOINTMENT_STANDARD_DURATION";

export function StiProtectionAppointmentStandardDuration() {
  return (
    <AppointmentStandardDurationConfiguratorForm
      moduleName={ConfiguratorModuleName.StiProtection}
      endpointName={STI_PROTECTION_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME}
      fields={fields}
      queryHook={useGetStiProtectionStandardDurations}
      updateHook={useUpdateStiProtectionAppointmentStandardDuration}
    />
  );
}

enum FormNames {
  CONSULTATION = "consultation",
  RESULTS_REVIEW = "resultsReview",
}

interface StiProtectionAppointmentStandardDurationFormValues
  extends FormikValues {
  [FormNames.CONSULTATION]: OptionalFieldValue<number>;
  [FormNames.RESULTS_REVIEW]: OptionalFieldValue<number>;
}

const fields: StandardDurationField<StiProtectionAppointmentStandardDurationFormValues>[] =
  [
    {
      name: FormNames.CONSULTATION,
      label: "Termindauer HIV-STI-Beratung in Minuten",
    },
    {
      name: FormNames.RESULTS_REVIEW,
      label: "Termindauer Ergebnisbesprechung in Minuten",
      alert: {
        color: "primary",
        message:
          "Wenn Sie die Termindauer für “Ergebnisbesprechung” definieren, wird die Angabe auch für die Abteilung Sexarbeit übernommen.",
      },
    },
  ];

function mapValues(values: StiProtectionAppointmentStandardDurationFormValues) {
  return {
    consultation: mapDurationValue(values.consultation),
    resultsReview: mapDurationValue(values.resultsReview),
  };
}

function useStandardizedAppointmentDurationConfigApi() {
  const api = useStiProtectionAppointmentStandardDurationConfigApi();
  function updateStandardDurations(
    params: ApiHivStiConsultationAppointmentStandardDurations,
  ) {
    return api.updateHivStiConsultationAppointmentStandardDurations(params);
  }
  function getStandardDurationsConfig() {
    return api.getHivStiConsultationAppointmentStandardDurationsConfig();
  }
  return {
    updateStandardDurations,
    getStandardDurationsConfig,
  };
}

function useUpdateStiProtectionAppointmentStandardDuration() {
  return useUpdateAppointmentStandardDuration(
    useStandardizedAppointmentDurationConfigApi,
    mapValues,
  );
}

function mapResponse(
  data: ApiGetHivStiConsultationAppointmentStandardDurationsResponse,
): StiProtectionAppointmentStandardDurationFormValues {
  const { standardDurations } = data;
  return {
    consultation: mapOptionalISODuration(standardDurations?.consultation),
    resultsReview: mapOptionalISODuration(standardDurations?.resultsReview),
  };
}

function useGetStiProtectionStandardDurations() {
  return useGetAppointmentStandardDurations(
    ConfiguratorModuleName.StiProtection,
    useStandardizedAppointmentDurationConfigApi,
    mapResponse,
  );
}
