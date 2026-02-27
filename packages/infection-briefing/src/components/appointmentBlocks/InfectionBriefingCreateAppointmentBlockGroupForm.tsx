/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlock,
  ApiCreateDailyAppointmentBlockGroupRequest,
} from "@eshg/infection-briefing-api";
import {
  AppointmentBlockGroupValuesWithDays,
  emptyAppointmentBlockGroup,
  toLocalDateTime,
  useGetUsersByGroupQuery,
} from "@eshg/lib-employee-portal";
import { mapOptionalValue } from "@eshg/lib-portal";

import { useCreateDailyAppointmentBlocksForGroup } from "../../api/mutations/appointmentBlockApi";
import { useGetAppointmentStandardDurationOptions } from "../../api/queries/appointmentStandardDuration";
import { routes } from "../../config/routes";
import { useInfectionBriefingApiClients } from "../../contexts/InfectionBriefingApi";

import {
  AppointmentBlockGroupForm,
  InfectionBriefingAppointmentValues,
} from "./AppointmentBlockGroupForm";

const APPOINTMENT_TYPES: ApiAppointmentType[] = [
  ApiAppointmentType.InfectionBriefingNew,
  ApiAppointmentType.InfectionBriefingReplacement,
];

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
  values: InfectionBriefingAppointmentValues,
): ApiCreateDailyAppointmentBlockGroupRequest {
  return {
    types: values.types,
    parallelExaminations: 1,
    appointmentBlocks: values.appointmentBlocks.map(mapAppointmentBlock),
    room: mapOptionalValue(values.room),
    consultants: values.consultants,
    availableForCitizen: values.availableForCitizen,
  };
}

export function CreateAppointmentBlockGroupForm() {
  const router = useRouter();
  const createDailyAppointmentBlocksForGroup =
    useCreateDailyAppointmentBlocksForGroup();
  const { appointmentStandardDurationApi } = useInfectionBriefingApiClients();

  const [{ data: standardDurations }, { data: allConsultants }] =
    useSuspenseQueries({
      queries: [
        useGetAppointmentStandardDurationOptions(
          appointmentStandardDurationApi,
        ),
        useGetUsersByGroupQuery("[System] InfB-Berater"),
      ],
    });

  async function handleSubmit(values: InfectionBriefingAppointmentValues) {
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

  const INITIAL_VALUES: InfectionBriefingAppointmentValues = {
    types: APPOINTMENT_TYPES,
    appointmentBlocks: [emptyAppointmentBlockGroup()],
    room: "",
    consultants: [],
    availableForCitizen: true,
  };

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
