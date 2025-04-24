/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDateString, isTimeString } from "@eshg/lib-portal/helpers/dateTime";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { ApiAppointmentType } from "@eshg/measles-protection-api";
import { Chip, Stack, Typography } from "@mui/joy";
import { eachDayOfInterval, intervalToDuration } from "date-fns";

import {
  AppointmentBlockGroupValuesWithDays,
  WEEKDAY_CHECKBOX_OPTIONS,
} from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
import { toLocalDateTime } from "@/lib/shared/helpers/dateTime";

export interface AppointmentBlockGroupValues {
  type: OptionalFieldValue<ApiAppointmentType>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
}

function isValidAppointmentBlock(
  appointmentBlock: AppointmentBlockGroupValuesWithDays,
) {
  return (
    isDateString(appointmentBlock.startDate) &&
    isDateString(appointmentBlock.endDate) &&
    isTimeString(appointmentBlock.startTime) &&
    isTimeString(appointmentBlock.endTime)
  );
}

function getBlockDurationInMinutes(start: Date, end: Date) {
  const { hours = 0, minutes = 0 } = intervalToDuration({
    start,
    end,
  });

  return hours * 60 + minutes;
}

export function calculateAppointmentsPerBlock(
  type: OptionalFieldValue<ApiAppointmentType>,
  start: Date,
  end: Date,
  appointmentDurations: Record<string, number>,
) {
  const blockDurationInMinutes = getBlockDurationInMinutes(start, end);
  const appointmentDurationInMinutes = getAppointmentDurationInMinutes(
    type,
    appointmentDurations,
  );
  const appointmentCount =
    blockDurationInMinutes / appointmentDurationInMinutes;

  return Number.isInteger(appointmentCount) && appointmentCount > 0
    ? appointmentCount
    : 0;
}

export function getAppointmentDurationInMinutes<A extends string>(
  type: OptionalFieldValue<A>,
  appointmentDurations: Record<string, number>,
) {
  return isEmptyString(type) ? 0 : (appointmentDurations[type] ?? 0);
}

export function calculateAppointmentCount({
  type: appointmentType,
  appointmentBlocks,
  appointmentDurations,
  parallelExaminations,
  skipCalculatingOfBlocks,
}: AppointmentBlockGroupValues & {
  appointmentDurations: Record<string, number>;
  parallelExaminations: number;
  skipCalculatingOfBlocks: boolean | undefined;
}) {
  if (
    isEmptyString(appointmentType) ||
    !appointmentBlocks.length ||
    skipCalculatingOfBlocks
  ) {
    return 0;
  }

  let totalCount = 0;

  for (const appointmentBlock of appointmentBlocks) {
    if (isValidAppointmentBlock(appointmentBlock)) {
      const { startDate, startTime, endDate, endTime, daysOfWeek } =
        appointmentBlock;
      const start = toLocalDateTime(startDate, startTime);
      const end = toLocalDateTime(endDate, endTime);
      const daysInDateRange = eachDayOfInterval({
        start,
        end,
      });
      const includedDaysInDateRange = daysInDateRange.filter((day) => {
        return daysOfWeek.includes(WEEKDAY_CHECKBOX_OPTIONS[day.getDay()]!.id);
      });
      let appointmentsInBlockGroup = 0;

      includedDaysInDateRange.forEach((_day) => {
        appointmentsInBlockGroup += calculateAppointmentsPerBlock(
          appointmentType,
          start,
          end,
          appointmentDurations,
        );
      });

      totalCount += appointmentsInBlockGroup;
    }
  }

  return totalCount * parallelExaminations;
}

interface AppointmentCountWithDaysProps {
  appointments: AppointmentBlockGroupValues;
  appointmentDurations: Record<string, number>;
  parallelExaminations: number;
  skipCalculatingOfBlocks?: boolean;
}

export function AppointmentCountWithDays({
  appointmentDurations,
  appointments,
  parallelExaminations,
  skipCalculatingOfBlocks,
}: Readonly<AppointmentCountWithDaysProps>) {
  return (
    <Stack direction="row" gap={1}>
      <Typography level="title-sm">Termine</Typography>
      <Chip color="primary" data-testid="appointmentCount">
        {calculateAppointmentCount({
          ...appointments,
          appointmentDurations,
          parallelExaminations,
          skipCalculatingOfBlocks,
        })}
      </Chip>
    </Stack>
  );
}
