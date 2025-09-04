/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useRouter } from "next/navigation";

import {
  AppointmentBlockGroupValues,
  AppointmentBlockGroupValuesWithDays,
  emptyAppointmentBlockGroup,
} from "@eshg/lib-employee-portal";
import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlock,
  ApiCreateDailyAppointmentBlockGroupRequest,
} from "@eshg/measles-protection-api";

import { AppointmentDurationsMeasles } from "@/lib/businessModules/measlesProtection/api/models/AppointmentBlockGroup";
import { useCreateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/measlesProtection/api/mutations/appointmentBlockApi";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { toLocalDateTime } from "@/lib/shared/helpers/dateTime";

import { AppointmentBlockGroupForm } from "./AppointmentBlockGroupForm";

const INITIAL_VALUES: AppointmentBlockGroupValues = {
  types: [ApiAppointmentType.ProofSubmission],
  appointmentBlocks: [emptyAppointmentBlockGroup()],
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
  };
}

interface CreateAppointmentBlockGroupFormProps {
  appointmentDurationsMeasles: AppointmentDurationsMeasles;
}

export function CreateAppointmentBlockGroupForm({
  appointmentDurationsMeasles,
}: Readonly<CreateAppointmentBlockGroupFormProps>) {
  const router = useRouter();
  const createDailyAppointmentBlocksForGroup =
    useCreateDailyAppointmentBlocksForGroup();

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
      appointmentDurationsMeasles={appointmentDurationsMeasles}
      initialValues={INITIAL_VALUES}
      onSubmit={async (values) => {
        await handleSubmit(values);
      }}
    />
  );
}
