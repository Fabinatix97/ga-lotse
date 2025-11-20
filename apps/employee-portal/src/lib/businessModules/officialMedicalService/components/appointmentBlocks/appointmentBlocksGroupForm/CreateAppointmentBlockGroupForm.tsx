/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  AppointmentBlockGroupValuesWithDays,
  emptyAppointmentBlockGroup,
} from "@eshg/lib-employee-portal";
import {
  OptionalFieldValue,
  isTimeString,
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlock,
  ApiCreateDailyAppointmentBlockGroupRequest,
} from "@eshg/official-medical-service-api";

import { useCreateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/officialMedicalService/api/mutations/appointmentBlocksApi";
import { useGetAllPhysiciansQuery } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentStaffApi";
import { useGetAppointmentStandardDurationQuery } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentStandardDurationsApi";
import { AppointmentBlockGroupForm } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/appointmentBlocksGroupForm/AppointmentBlockGroupForm";
import { SUPPORTED_APPOINTMENT_TYPES } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/options";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { toLocalDateTime } from "@/lib/shared/helpers/dateTime";

const INITIAL_VALUES: CreateAppointmentBlockGroupValues = {
  types: SUPPORTED_APPOINTMENT_TYPES,
  parallelExaminations: 1,
  appointmentBlocks: [emptyAppointmentBlockGroup()],
  physicians: [],
  room: "",
};

export function mapFormValues(
  values: CreateAppointmentBlockGroupValues,
): ApiCreateDailyAppointmentBlockGroupRequest {
  return {
    types: values.types,
    parallelExaminations: mapRequiredValue(values.parallelExaminations),
    appointmentBlocks: values.appointmentBlocks.map(mapAppointmentBlock),
    physicians: values.physicians,
    room: mapOptionalValue(values.room),
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

export interface CreateAppointmentBlockGroupValues {
  types: ApiAppointmentType[];
  parallelExaminations: OptionalFieldValue<number>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
  physicians: string[];
  room: string;
}

export function CreateAppointmentBlockGroupForm() {
  const router = useRouter();
  const createDailyAppointmentBlocksForGroup =
    useCreateDailyAppointmentBlocksForGroup();

  const [{ data: allPhysicians }, { data: standardDurations }] =
    useSuspenseQueries({
      queries: [
        useGetAllPhysiciansQuery(),
        useGetAppointmentStandardDurationQuery(),
      ],
    });

  async function handleSubmit(values: CreateAppointmentBlockGroupValues) {
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
      standardDuration={standardDurations}
      allPhysicians={allPhysicians}
      onSubmit={handleSubmit}
    />
  );
}
