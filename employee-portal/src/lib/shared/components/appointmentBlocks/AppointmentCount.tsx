/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDateString } from "@eshg/lib-portal/helpers/dateTime";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Chip, Stack, Typography } from "@mui/joy";
import { intervalToDuration } from "date-fns";

import { AppointmentBlockValues } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockForm";
import {
  isBeforeTime,
  isTimeString,
  toLocalDateTime,
} from "@/lib/shared/helpers/dateTime";

interface AppointmentTypeConfig<A> {
  appointmentTypeDto: A;
  standardDurationInMinutes: number;
}

export interface AppointmentValues<A, B extends AppointmentTypeConfig<A>> {
  type: OptionalFieldValue<A>;
  parallelExaminations: OptionalFieldValue<number>;
  appointmentBlocks: AppointmentBlockValues[];
  allAppointmentTypes: B[];
  physicians: string[];
  mfas: string[];
  locationId: OptionalFieldValue<string>;
}

export function calculateAppointmentCount<
  A,
  B extends AppointmentTypeConfig<A>,
>(values: AppointmentValues<A, B>) {
  if (
    isEmptyString(values.type) ||
    isEmptyString(values.parallelExaminations)
  ) {
    return 0;
  }

  let totalCount = 0;
  for (const appointmentBlock of values.appointmentBlocks) {
    if (isValidAppointmentBlock(appointmentBlock)) {
      const start = toLocalDateTime(
        appointmentBlock.date,
        appointmentBlock.startTime,
      );
      const end = toLocalDateTime(
        appointmentBlock.date,
        appointmentBlock.endTime,
      );
      totalCount += calculateAppointmentsPerBlock(
        values.type,
        start,
        end,
        values.allAppointmentTypes,
      );
    }
  }
  return values.parallelExaminations * totalCount;
}

function isValidAppointmentBlock(appointmentBlock: AppointmentBlockValues) {
  return (
    isDateString(appointmentBlock.date) &&
    isTimeString(appointmentBlock.startTime) &&
    isTimeString(appointmentBlock.endTime) &&
    isBeforeTime(
      appointmentBlock.startTime,
      appointmentBlock.endTime,
      new Date(appointmentBlock.date),
    )
  );
}

export function calculateAppointmentsPerBlock<
  A,
  B extends AppointmentTypeConfig<A>,
>(
  type: OptionalFieldValue<A>,
  start: Date,
  end: Date,
  allAppointmentTypes: B[],
) {
  const blockDurationInMinutes = getBlockDurationInMinutes(start, end);
  const appointmentDurationInMinutes = getAppointmentDurationInMinutes(
    type,
    allAppointmentTypes,
  );
  const appointmentCount =
    blockDurationInMinutes / appointmentDurationInMinutes;
  return Number.isInteger(appointmentCount) ? appointmentCount : 0;
}

function getBlockDurationInMinutes(start: Date, end: Date) {
  const { hours = 0, minutes = 0 } = intervalToDuration({
    start,
    end,
  });
  return hours * 60 + minutes;
}

export function getAppointmentDurationInMinutes<
  A,
  B extends AppointmentTypeConfig<A>,
>(type: OptionalFieldValue<A>, allAppointmentTypes: B[]) {
  return (
    allAppointmentTypes.find((appointmentType) => {
      if (appointmentType.appointmentTypeDto === type) {
        return appointmentType.standardDurationInMinutes;
      }
    })?.standardDurationInMinutes ?? 0
  );
}

export function AppointmentCount<A, B extends AppointmentTypeConfig<A>>(
  props: Readonly<{ appointments: AppointmentValues<A, B> }>,
) {
  return (
    <Stack direction="row" gap={1}>
      <Typography level="title-sm">Termine</Typography>
      <Chip color="primary" data-testid="appointmentCount">
        {calculateAppointmentCount(props.appointments)}
      </Chip>
    </Stack>
  );
}
