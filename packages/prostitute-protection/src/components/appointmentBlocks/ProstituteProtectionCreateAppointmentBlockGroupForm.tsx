/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  AppointmentBlockGroupValuesWithDays,
  emptyAppointmentBlockGroup,
  toLocalDateTime,
  useGetUsersByGroupQuery,
} from "@eshg/lib-employee-portal";
import { mapOptionalValue } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlock,
  ApiCreateDailyAppointmentBlockGroupRequest,
} from "@eshg/prostitute-protection-api";

import { useCreateDailyAppointmentBlocksForGroup } from "../../api/mutations/appointmentBlockApi";
import { useGetAppointmentStandardDurationOptions } from "../../api/queries/appointmentStandardDuration";
import { routes } from "../../config/routes";

import {
  AppointmentBlockGroupForm,
  ProstituteProtectionAppointmentValues,
} from "./AppointmentBlockGroupForm";

const APPOINTMENT_TYPES: ApiAppointmentType[] = [
  ApiAppointmentType.ProstituteProtectionConsultation,
];

const INITIAL_VALUES: ProstituteProtectionAppointmentValues = {
  types: APPOINTMENT_TYPES,
  appointmentBlocks: [emptyAppointmentBlockGroup()],
  room: "",
  consultants: [],
};

function mapAppointmentBlock(
  values: AppointmentBlockGroupValuesWithDays,
): ApiCreateDailyAppointmentBlock {
  return {
    daysOfWeek: values.daysOfWeek,
    start: toLocalDateTime(values.startDate, values.startTime),
    end: toLocalDateTime(values.endDate, values.endTime),
  };
}

export function mapFormValues(
  values: ProstituteProtectionAppointmentValues,
): ApiCreateDailyAppointmentBlockGroupRequest {
  return {
    types: values.types,
    parallelExaminations: 1,
    appointmentBlocks: values.appointmentBlocks.map(mapAppointmentBlock),
    room: mapOptionalValue(values.room),
    consultants: values.consultants,
  };
}

export function CreateAppointmentBlockGroupForm() {
  const router = useRouter();
  const createDailyAppointmentBlocksForGroup =
    useCreateDailyAppointmentBlocksForGroup();

  const [{ data: standardDurations }, { data: allConsultants }] =
    useSuspenseQueries({
      queries: [
        useGetAppointmentStandardDurationOptions(),
        useGetUsersByGroupQuery("[System] ProstSchG-Berater"),
      ],
    });

  async function handleSubmit(values: ProstituteProtectionAppointmentValues) {
    const appointmentBlockGroupValues = mapFormValues(values);
    await createDailyAppointmentBlocksForGroup.mutateAsync(
      appointmentBlockGroupValues,
      {
        onSuccess: () => {
          router.push(routes.appointmentBlockGroups.index);
        },
      },
    );
  }

  return (
    <AppointmentBlockGroupForm
      initialValues={INITIAL_VALUES}
      standardDurations={standardDurations}
      allConsultants={allConsultants}
      onSubmit={async (values) => {
        await handleSubmit(values);
      }}
    />
  );
}
