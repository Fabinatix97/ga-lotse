/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  AppointmentBlockGroupValues,
  AppointmentBlockGroupValuesWithDays,
  emptyAppointmentBlockGroup,
} from "@eshg/lib-employee-portal";
import { mapOptionalValue } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlock,
  ApiCreateDailyAppointmentBlockGroupRequest,
} from "@eshg/measles-protection-api";

import { useCreateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/measlesProtection/api/mutations/appointmentBlockApi";
import { useGetAppointmentStandardDurationQuery } from "@/lib/businessModules/measlesProtection/api/queries/appointmentStandardConfiguration";
import { SUPPORTED_APPOINTMENT_TYPES } from "@/lib/businessModules/measlesProtection/components/appointmentBlocks/options";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { toLocalDateTime } from "@/lib/shared/helpers/dateTime";

import { AppointmentBlockGroupForm } from "./AppointmentBlockGroupForm";

const INITIAL_VALUES: AppointmentBlockGroupValues = {
  types: SUPPORTED_APPOINTMENT_TYPES,
  appointmentBlocks: [emptyAppointmentBlockGroup()],
  room: "",
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

function mapFormValues(
  values: AppointmentBlockGroupValues,
): ApiCreateDailyAppointmentBlockGroupRequest {
  return {
    types: [ApiAppointmentType.ProofSubmission],
    parallelExaminations: 1,
    appointmentBlocks: values.appointmentBlocks.map(mapAppointmentBlock),
    physicians: undefined,
    mfas: undefined,
    room: mapOptionalValue(values.room),
  };
}

export function CreateAppointmentBlockGroupForm() {
  const router = useRouter();
  const createDailyAppointmentBlocksForGroup =
    useCreateDailyAppointmentBlocksForGroup();
  const { data: standardDurations } = useSuspenseQuery(
    useGetAppointmentStandardDurationQuery(),
  );

  async function handleSubmit(values: AppointmentBlockGroupValues) {
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
      appointmentDurationsMeasles={standardDurations}
      initialValues={INITIAL_VALUES}
      onSubmit={async (values) => {
        await handleSubmit(values);
      }}
    />
  );
}
