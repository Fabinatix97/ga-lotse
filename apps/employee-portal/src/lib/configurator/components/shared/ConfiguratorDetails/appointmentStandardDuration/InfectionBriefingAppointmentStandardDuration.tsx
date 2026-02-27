/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

import { ApiGetInfectionBriefingAppointmentStandardDurationsResponse } from "@eshg/infection-briefing-api";
import { OptionalFieldValue } from "@eshg/lib-portal";

import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useInfectionBriefingAppointmentStandardDurationConfigApi } from "@/lib/shared/api/clients";
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

export const INFECTION_BRIEFING_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME =
  "INFECTION_BRIEFING_APPOINTMENT_STANDARD_DURATION";

export function InfectionBriefingAppointmentStandardDuration() {
  return (
    <AppointmentStandardDurationConfiguratorForm
      moduleName={ConfiguratorModuleName.InfectionBriefing}
      endpointName={
        INFECTION_BRIEFING_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME
      }
      fields={fields}
      queryHook={useGetInfectionBriefingStandardDurations}
      updateHook={useUpdateInfectionBriefingAppointmentStandardDuration}
    />
  );
}

enum FormNames {
  INFECTION_BRIEFING_NEW = "infectionBriefingNew",
  INFECTION_BRIEFING_REPLACEMENT = "infectionBriefingReplacement",
}

interface InfectionBriefingAppointmentStandardDurationFormValues extends FormikValues {
  [FormNames.INFECTION_BRIEFING_NEW]: OptionalFieldValue<number>;
  [FormNames.INFECTION_BRIEFING_REPLACEMENT]: OptionalFieldValue<number>;
}

const fields: StandardDurationField<InfectionBriefingAppointmentStandardDurationFormValues>[] =
  [
    {
      name: FormNames.INFECTION_BRIEFING_NEW,
      label: "Termindauer Neuer Lebensmittelausweis in Minuten",
    },
    {
      name: FormNames.INFECTION_BRIEFING_REPLACEMENT,
      label: "Termindauer Lebensmittelausweis Duplikat in Minuten",
    },
  ];

function mapValues(
  values: InfectionBriefingAppointmentStandardDurationFormValues,
) {
  return {
    infectionBriefingNew: mapDurationValue(values.infectionBriefingNew),
    infectionBriefingReplacement: mapDurationValue(
      values.infectionBriefingReplacement,
    ),
  };
}

function useUpdateInfectionBriefingAppointmentStandardDuration() {
  return useUpdateAppointmentStandardDuration(
    useInfectionBriefingAppointmentStandardDurationConfigApi,
    mapValues,
  );
}

function mapResponse(
  data: ApiGetInfectionBriefingAppointmentStandardDurationsResponse,
): InfectionBriefingAppointmentStandardDurationFormValues {
  const { standardDurations } = data;
  return {
    infectionBriefingNew: mapOptionalISODuration(
      standardDurations?.infectionBriefingNew,
    ),
    infectionBriefingReplacement: mapOptionalISODuration(
      standardDurations?.infectionBriefingReplacement,
    ),
  };
}

function useGetInfectionBriefingStandardDurations() {
  return useGetAppointmentStandardDurations(
    ConfiguratorModuleName.InfectionBriefing,
    useInfectionBriefingAppointmentStandardDurationConfigApi,
    mapResponse,
  );
}
