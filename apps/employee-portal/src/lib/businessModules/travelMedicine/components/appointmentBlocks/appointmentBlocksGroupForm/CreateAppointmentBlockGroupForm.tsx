/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  AppointmentBlockGroupValuesWithDays,
  emptyAppointmentBlockGroup,
} from "@eshg/lib-employee-portal";
import { isTimeString, mapRequiredValue } from "@eshg/lib-portal";
import {
  ApiCreateDailyAppointmentBlock,
  ApiCreateDailyAppointmentBlockGroupRequest,
} from "@eshg/travel-medicine-api";

import { useAppointmentStandardDurationsApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { useCreateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/travelMedicine/api/mutations/appointmentBlocks";
import {
  useGetAllMedicalAssistantsQuery,
  useGetAllPhysiciansQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/appointmentStaff";
import { useGetAppointmentStandardDurationsQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentStandardDurations";
import { SUPPORTED_APPOINTMENT_TYPES } from "@/lib/businessModules/travelMedicine/components/appointmentBlocks/options";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { toLocalDateTime } from "@/lib/shared/helpers/dateTime";

import {
  AppointmentBlockGroupForm,
  AppointmentBlockGroupValues,
} from "./AppointmentBlockGroupForm";

const INITIAL_VALUES: AppointmentBlockGroupValues = {
  types: SUPPORTED_APPOINTMENT_TYPES,
  parallelExaminations: 1,
  appointmentBlocks: [emptyAppointmentBlockGroup()],
  mfas: [],
  physicians: [],
};

export function mapFormValues(
  values: AppointmentBlockGroupValues,
): ApiCreateDailyAppointmentBlockGroupRequest {
  return {
    types: values.types,
    parallelExaminations: mapRequiredValue(values.parallelExaminations),
    appointmentBlocks: values.appointmentBlocks.map(mapAppointmentBlock),
    physicians: values.physicians,
    mfas: values.mfas,
  };
}

function mapAppointmentBlock(
  values: AppointmentBlockGroupValuesWithDays,
): ApiCreateDailyAppointmentBlock {
  if (!isTimeString(values.startTime) || !isTimeString(values.endTime)) {
    throw new Error("Invalid time string");
  }
  return {
    daysOfWeek: values.daysOfWeek,
    start: toLocalDateTime(values.startDate, values.startTime),
    end: toLocalDateTime(values.endDate, values.endTime),
  };
}

export function CreateAppointmentBlockGroupForm() {
  const standardDurationApi = useAppointmentStandardDurationsApi();
  const [
    { data: allPhysicians },
    { data: allMedicalAssistants },
    { data: standardDurations },
  ] = useSuspenseQueries({
    queries: [
      useGetAllPhysiciansQuery(),
      useGetAllMedicalAssistantsQuery(),
      useGetAppointmentStandardDurationsQuery(standardDurationApi),
    ],
  });

  const router = useRouter();
  const createDailyAppointmentBlocksForGroup =
    useCreateDailyAppointmentBlocksForGroup();

  async function handleSubmit(values: AppointmentBlockGroupValues) {
    await createDailyAppointmentBlocksForGroup.mutateAsync(
      mapFormValues(values),
      {
        onSuccess: () => router.push(routes.appointmentBlockGroups.index),
      },
    );
  }

  return (
    <AppointmentBlockGroupForm
      initialValues={INITIAL_VALUES}
      standardDurations={standardDurations}
      allPhysicians={allPhysicians}
      allMedicalAssistants={allMedicalAssistants}
      onSubmit={handleSubmit}
    />
  );
}
