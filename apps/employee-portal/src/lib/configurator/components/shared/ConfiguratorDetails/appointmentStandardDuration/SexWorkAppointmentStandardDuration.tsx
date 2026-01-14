/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

import { OptionalFieldValue } from "@eshg/lib-portal";
import {
  ApiGetSexWorkAppointmentStandardDurationsResponse,
  ApiSexWorkAppointmentStandardDurations,
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

export const SEX_WORK_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME =
  "SEX_WORK_APPOINTMENT_STANDARD_DURATION";

export function SexWorkAppointmentStandardDuration() {
  return (
    <AppointmentStandardDurationConfiguratorForm
      moduleName={ConfiguratorModuleName.sexWork}
      endpointName={SEX_WORK_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME}
      fields={fields}
      queryHook={useGetSexWorkStandardDurationsConfig}
      updateHook={useUpdateSexWorkAppointmentStandardDurationConfig}
    />
  );
}

enum FormNames {
  CONSULTATION = "consultation",
  RESULT_REVIEW = "resultReview",
}

interface SexWorkAppointmentStandardDurationFormValues extends FormikValues {
  [FormNames.CONSULTATION]: OptionalFieldValue<number>;
  [FormNames.RESULT_REVIEW]: OptionalFieldValue<number>;
}

const fields: StandardDurationField<SexWorkAppointmentStandardDurationFormValues>[] =
  [
    {
      name: FormNames.CONSULTATION,
      label: "Termindauer Sexarbeit Beratung in Minuten",
    },
    {
      name: FormNames.RESULT_REVIEW,
      label: "Termindauer Ergebnisbesprechung in Minuten",
      alert: {
        color: "primary",
        message:
          "Wenn Sie die Termindauer für “Ergebnisbesprechung” definieren, wird die Angabe auch für die Abteilung HIV-STI-Beratung übernommen.",
      },
    },
  ];

function mapValues(values: SexWorkAppointmentStandardDurationFormValues) {
  return {
    consultation: mapDurationValue(values.consultation),
    resultReview: mapDurationValue(values.resultReview),
  };
}

function useStandardizedAppointmentDurationConfigApi() {
  const api = useStiProtectionAppointmentStandardDurationConfigApi();
  function updateStandardDurations(
    params: ApiSexWorkAppointmentStandardDurations,
  ) {
    return api.updateSexWorkAppointmentStandardDurations(params);
  }
  function getStandardDurationsConfig() {
    return api.getSexWorkAppointmentStandardDurationsConfig();
  }
  return {
    updateStandardDurations,
    getStandardDurationsConfig,
  };
}

function useUpdateSexWorkAppointmentStandardDurationConfig() {
  return useUpdateAppointmentStandardDuration(
    useStandardizedAppointmentDurationConfigApi,
    mapValues,
  );
}

function mapResponse(
  data: ApiGetSexWorkAppointmentStandardDurationsResponse,
): SexWorkAppointmentStandardDurationFormValues {
  const { standardDurations } = data;
  return {
    consultation: mapOptionalISODuration(standardDurations?.consultation),
    resultReview: mapOptionalISODuration(standardDurations?.resultReview),
  };
}

function useGetSexWorkStandardDurationsConfig() {
  return useGetAppointmentStandardDurations(
    ConfiguratorModuleName.sexWork,
    useStandardizedAppointmentDurationConfigApi,
    mapResponse,
  );
}
