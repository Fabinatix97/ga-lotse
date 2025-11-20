/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ApiAddContact200Response } from "@eshg/base-api";
import {
  AppointmentBlockGroupValuesWithDays,
  emptyAppointmentBlockGroup,
} from "@eshg/lib-employee-portal";
import {
  OptionalFieldValue,
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlock,
  ApiCreateDailyAppointmentBlockGroupRequest,
} from "@eshg/school-entry-api";

import { useUserApi } from "@/lib/baseModule/api/clients";
import {
  useAppointmentBlockDefaultAvailabilityApi,
  useAppointmentStandardDurationsApi,
  useConfigApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { useCreateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/schoolEntry/api/mutations/appointmentBlockApi";
import { getAppointmentBlockDefaultAvailabilityQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentBlockDefaultAvailabilityApi";
import {
  getAllMedicalAssistantsQuery,
  getAllPhysiciansQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/appointmentStaff";
import { useGetAppointmentStandardDurationsQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentStandardDuration";
import { getLocationSelectionModeQuery } from "@/lib/businessModules/schoolEntry/api/queries/configApi";
import { SUPPORTED_APPOINTMENT_TYPES } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { toLocalDateTime } from "@/lib/shared/helpers/dateTime";

import { AppointmentBlockGroupForm } from "./AppointmentBlockGroupForm";

const INITIAL_VALUES: CreateAppointmentBlockGroupValues = {
  types: SUPPORTED_APPOINTMENT_TYPES,
  parallelExaminations: 1,
  appointmentBlocks: [emptyAppointmentBlockGroup()],
  physicians: [],
  mfas: [],
  room: "",
  location: null,
  availableForCitizen: true,
  availableForBulkBooking: true,
};

export function mapFormValues(
  values: CreateAppointmentBlockGroupValues,
): ApiCreateDailyAppointmentBlockGroupRequest {
  return {
    types: values.types,
    parallelExaminations: mapRequiredValue(values.parallelExaminations),
    appointmentBlocks: values.appointmentBlocks.map(mapAppointmentBlock),
    physicians: values.physicians,
    mfas: values.mfas,
    locationId: mapOptionalValue(values.location)?.id,
    availableForCitizen: values.availableForCitizen,
    availableForBulkBooking: values.availableForBulkBooking,
    room: mapOptionalValue(values.room),
  };
}

function mapAppointmentBlock(
  values: AppointmentBlockGroupValuesWithDays,
): ApiCreateDailyAppointmentBlock {
  return {
    daysOfWeek: values.daysOfWeek,
    start: toLocalDateTime(values.startDate, values.startTime),
    end: toLocalDateTime(values.endDate, values.endTime),
  };
}

export interface CreateAppointmentBlockGroupValues {
  types: ApiAppointmentType[];
  parallelExaminations: OptionalFieldValue<number>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
  physicians: string[];
  mfas: string[];
  room: string;
  location: ApiAddContact200Response | null;
  availableForCitizen: boolean;
  availableForBulkBooking: boolean;
}

export function CreateAppointmentBlockGroupForm() {
  const router = useRouter();
  const createDailyAppointmentBlockGroup =
    useCreateDailyAppointmentBlocksForGroup();
  const configApi = useConfigApi();
  const userApi = useUserApi();
  const appointmentBlockDefaultAvailabilityApi =
    useAppointmentBlockDefaultAvailabilityApi();
  const standardDurationApi = useAppointmentStandardDurationsApi();

  const [
    { data: locationSelectionMode },
    { data: standardDurations },
    { data: allPhysicians },
    { data: allMfas },
    { data: defaultAvailabilityFlags },
  ] = useSuspenseQueries({
    queries: [
      getLocationSelectionModeQuery(configApi),
      useGetAppointmentStandardDurationsQuery(standardDurationApi),
      getAllPhysiciansQuery(userApi),
      getAllMedicalAssistantsQuery(userApi),
      getAppointmentBlockDefaultAvailabilityQuery(
        appointmentBlockDefaultAvailabilityApi,
      ),
    ],
  });

  const initialValues = {
    ...INITIAL_VALUES,
    ...defaultAvailabilityFlags,
  };

  async function handleSubmit(values: CreateAppointmentBlockGroupValues) {
    await createDailyAppointmentBlockGroup.mutateAsync(mapFormValues(values), {
      onSuccess: () => router.push(routes.appointments.overview),
    });
  }

  return (
    <AppointmentBlockGroupForm
      initialValues={initialValues}
      standardDurations={standardDurations}
      allPhysicians={allPhysicians}
      allMfas={allMfas}
      locationSelectionMode={locationSelectionMode}
      onSubmit={handleSubmit}
    />
  );
}
