/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

import { OptionalFieldValue } from "@eshg/lib-portal";
import { ApiGetTravelMedicineAppointmentStandardDurationsResponse } from "@eshg/travel-medicine-api";

import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useTravelMedicineAppointmentStandardDurationConfigApi } from "@/lib/shared/api/clients";
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

export const TRAVEL_MEDICINE_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME =
  "TRAVEL_MEDICINE_APPOINTMENT_STANDARD_DURATION";

export function TravelMedicineAppointmentStandardDuration() {
  return (
    <AppointmentStandardDurationConfiguratorForm
      moduleName={ConfiguratorModuleName.TravelMedicine}
      endpointName={TRAVEL_MEDICINE_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME}
      fields={fields}
      queryHook={useGetTravelMedicineStandardDurations}
      updateHook={useUpdateTravelMedicineAppointmentStandardDuration}
    />
  );
}

enum FormNames {
  CONSULTATION = "consultation",
  VACCINATION = "vaccination",
}

interface TravelMedicineAppointmentStandardDurationFormValues
  extends FormikValues {
  [FormNames.CONSULTATION]: OptionalFieldValue<number>;
  [FormNames.VACCINATION]: OptionalFieldValue<number>;
}

const fields: StandardDurationField<TravelMedicineAppointmentStandardDurationFormValues>[] =
  [
    {
      name: FormNames.CONSULTATION,
      label: "Termindauer Beratung in Minuten",
    },
    {
      name: FormNames.VACCINATION,
      label: "Termindauer Impfung in Minuten",
    },
  ];

function mapValues(
  values: TravelMedicineAppointmentStandardDurationFormValues,
) {
  return {
    consultation: mapDurationValue(values.consultation),
    vaccination: mapDurationValue(values.vaccination),
  };
}

function useUpdateTravelMedicineAppointmentStandardDuration() {
  return useUpdateAppointmentStandardDuration(
    useTravelMedicineAppointmentStandardDurationConfigApi,
    mapValues,
  );
}

function mapResponse(
  data: ApiGetTravelMedicineAppointmentStandardDurationsResponse,
): TravelMedicineAppointmentStandardDurationFormValues {
  const { standardDurations } = data;
  return {
    consultation: mapOptionalISODuration(standardDurations?.consultation),
    vaccination: mapOptionalISODuration(standardDurations?.vaccination),
  };
}

function useGetTravelMedicineStandardDurations() {
  return useGetAppointmentStandardDurations(
    ConfiguratorModuleName.TravelMedicine,
    useTravelMedicineAppointmentStandardDurationConfigApi,
    mapResponse,
  );
}
