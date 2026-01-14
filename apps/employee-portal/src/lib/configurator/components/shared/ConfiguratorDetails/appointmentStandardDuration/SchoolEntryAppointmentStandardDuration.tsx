/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

import { OptionalFieldValue } from "@eshg/lib-portal";
import { ApiGetSchoolEntryAppointmentStandardDurationsResponse } from "@eshg/school-entry-api";

import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useSchoolEntryAppointmentStandardDurationConfigApi } from "@/lib/shared/api/clients";
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

export const SCHOOL_ENTRY_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME =
  "SCHOOL_ENTRY_APPOINTMENT_STANDARD_DURATION";

export function SchoolEntryAppointmentStandardDuration() {
  return (
    <AppointmentStandardDurationConfiguratorForm
      moduleName={ConfiguratorModuleName.SchoolEntry}
      endpointName={SCHOOL_ENTRY_APPOINTMENT_STANDARD_DURATION_ENDPOINT_NAME}
      withExtraDuration
      fields={fields}
      queryHook={useGetSchoolEntryStandardDurations}
      updateHook={useUpdateSchoolEntryAppointmentStandardDuration}
    />
  );
}

enum FormNames {
  REGULAR_EXAMINATION = "regularExamination",
  ENTRY_LEVEL = "entryLevel",
  CAN_CHILD = "canChild",
  SPECIAL_NEEDS = "specialNeeds",
  EXTRA_DURATION = "extraDuration",
}

interface SchoolEntryAppointmentStandardDurationFormValues
  extends FormikValues {
  [FormNames.REGULAR_EXAMINATION]: OptionalFieldValue<number>;
  [FormNames.ENTRY_LEVEL]: OptionalFieldValue<number>;
  [FormNames.CAN_CHILD]: OptionalFieldValue<number>;
  [FormNames.SPECIAL_NEEDS]: OptionalFieldValue<number>;
  [FormNames.EXTRA_DURATION]: OptionalFieldValue<number>;
}

const fields: StandardDurationField<SchoolEntryAppointmentStandardDurationFormValues>[] =
  [
    {
      name: FormNames.REGULAR_EXAMINATION,
      label: "Termindauer Regelkind in Minuten",
    },
    {
      name: FormNames.ENTRY_LEVEL,
      label: "Termindauer Eingangsstufe in Minuten",
    },
    {
      name: FormNames.CAN_CHILD,
      label: "Termindauer Kann-Kind in Minuten",
    },
    {
      name: FormNames.SPECIAL_NEEDS,
      label: "Termindauer Besonderer Förderbedarf in Minuten",
    },
  ];

function mapValues(values: SchoolEntryAppointmentStandardDurationFormValues) {
  return {
    regularExamination: mapDurationValue(values.regularExamination),
    entryLevel: mapDurationValue(values.entryLevel),
    canChild: mapDurationValue(values.canChild),
    specialNeeds: mapDurationValue(values.specialNeeds),
    extraDuration: mapDurationValue(values.extraDuration),
  };
}

function useUpdateSchoolEntryAppointmentStandardDuration() {
  return useUpdateAppointmentStandardDuration(
    useSchoolEntryAppointmentStandardDurationConfigApi,
    mapValues,
  );
}

function mapResponse(
  data: ApiGetSchoolEntryAppointmentStandardDurationsResponse,
): SchoolEntryAppointmentStandardDurationFormValues {
  const { standardDurations } = data;
  return {
    regularExamination: mapOptionalISODuration(
      standardDurations?.regularExamination,
    ),
    entryLevel: mapOptionalISODuration(standardDurations?.entryLevel),
    canChild: mapOptionalISODuration(standardDurations?.canChild),
    specialNeeds: mapOptionalISODuration(standardDurations?.specialNeeds),
    extraDuration: mapOptionalISODuration(standardDurations?.extraDuration),
  };
}

function useGetSchoolEntryStandardDurations() {
  return useGetAppointmentStandardDurations(
    ConfiguratorModuleName.SchoolEntry,
    useSchoolEntryAppointmentStandardDurationConfigApi,
    mapResponse,
  );
}
