/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Delete } from "@mui/icons-material";
import { Button, Grid } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { addDays, eachDayOfInterval, getDay, max, min } from "date-fns";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { isDefined, isEmpty, unique } from "remeda";

import {
  TimeField,
  WeekdayCheckboxGroup,
  validateTodayOrFutureDate,
} from "@eshg/lib-employee-portal";
import {
  DateField,
  EnumMap,
  NestedFormProps,
  createFieldNameMapper,
} from "@eshg/lib-portal";
import { ApiDayOfWeek } from "@eshg/measles-protection-api";

export interface AppointmentBlockGroupValues {
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
}

export interface AppointmentBlockGroupValuesWithDays {
  daysOfWeek: ApiDayOfWeek[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface WeekdayCheckboxOption {
  id: ApiDayOfWeek;
  label: string;
  disabled?: boolean;
}

export const WEEKDAY_TYPES: EnumMap<ApiDayOfWeek> = {
  [ApiDayOfWeek.Sunday]: "Sonntag",
  [ApiDayOfWeek.Monday]: "Montag",
  [ApiDayOfWeek.Tuesday]: "Dienstag",
  [ApiDayOfWeek.Wednesday]: "Mittwoch",
  [ApiDayOfWeek.Thursday]: "Donnerstag",
  [ApiDayOfWeek.Friday]: "Freitag",
  [ApiDayOfWeek.Saturday]: "Samstag",
};

export const WEEKDAY_CHECKBOX_OPTIONS: WeekdayCheckboxOption[] = [
  { id: ApiDayOfWeek.Sunday, label: "So", disabled: true },
  { id: ApiDayOfWeek.Monday, label: "Mo" },
  { id: ApiDayOfWeek.Tuesday, label: "Di" },
  { id: ApiDayOfWeek.Wednesday, label: "Mi" },
  { id: ApiDayOfWeek.Thursday, label: "Do" },
  { id: ApiDayOfWeek.Friday, label: "Fr" },
  { id: ApiDayOfWeek.Saturday, label: "Sa", disabled: true },
];

export function getWeekdayFromDate(date: Date): string {
  return WEEKDAY_CHECKBOX_OPTIONS[date.getDay()]?.label ?? "";
}

const dateTimeFieldStyle: SxProps = {
  minWidth: "min(50vw, 208px)",
  pl: {
    xxs: 0,
    md: 1,
  },
};

export function emptyAppointmentBlockGroup(): AppointmentBlockGroupValuesWithDays {
  return {
    daysOfWeek: [],
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  };
}

interface AppointmentBlockFormWithDaysProps extends NestedFormProps {
  removeBlock: () => void;
  index: number;
  blockCount: number;
  ref?: (el: HTMLInputElement) => void;
}

export function AppointmentBlockFormWithDays(
  props: Readonly<AppointmentBlockFormWithDaysProps>,
) {
  const fieldName = createFieldNameMapper(props.name);
  const daysOfWeekFieldName = fieldName("daysOfWeek");
  const daysOfWeekOptions = WEEKDAY_CHECKBOX_OPTIONS.filter(
    ({ disabled }) => !disabled,
  );

  const {
    setFieldValue,
    values: { appointmentBlocks },
  } = useFormikContext<AppointmentBlockGroupValues>();
  const appointmentBlock = appointmentBlocks[props.index];

  useEffect(() => {
    const startDate = appointmentBlock?.startDate;
    const endDate = appointmentBlock?.endDate;
    if (isEmpty(startDate) || isEmpty(endDate)) {
      return;
    }

    void setFieldValue(
      daysOfWeekFieldName,
      getDaysOfWeekInInterval(new Date(startDate), new Date(endDate)),
    );
  }, [
    daysOfWeekFieldName,
    setFieldValue,
    appointmentBlock?.startDate,
    appointmentBlock?.endDate,
  ]);

  return (
    <Grid direction="column" xs={10} paddingTop={0}>
      <Grid container xs={12} direction="row" columnGap={0}>
        <Grid xs={2} sx={{ ...dateTimeFieldStyle, pl: 0 }}>
          <DateField
            ref={props.ref}
            name={fieldName("startDate")}
            label="Startdatum"
            required="Bitte ein Startdatum angeben."
            validate={validateTodayOrFutureDate}
          />
        </Grid>
        <Grid xs={2} sx={dateTimeFieldStyle}>
          <DateField
            name={fieldName("endDate")}
            label="Enddatum"
            required="Bitte ein Enddatum angeben."
            validate={validateTodayOrFutureDate}
          />
        </Grid>
        <Grid xs={2} sx={dateTimeFieldStyle}>
          <TimeField
            name={fieldName("startTime")}
            label="Startzeit"
            required="Bitte eine Startzeit angeben."
          />
        </Grid>
        <Grid xs={2} sx={dateTimeFieldStyle}>
          <TimeField
            name={fieldName("endTime")}
            label="Endzeit"
            required="Bitte eine Endzeit angeben."
          />
        </Grid>
      </Grid>
      <Grid container xs={12} direction="row" paddingLeft={0}>
        <Grid direction="column">
          <WeekdayCheckboxGroup
            name={daysOfWeekFieldName}
            options={daysOfWeekOptions}
            label="Wochentage"
            required
            sx={{ mt: 1 }}
          />
        </Grid>
      </Grid>
      {props.blockCount > 1 && (
        <Grid container xs={12} direction="row" padding={0}>
          <Grid direction="column">
            <Button
              variant="outlined"
              startDecorator={<Delete />}
              title="Terminblock entfernen"
              color="danger"
              onClick={props.removeBlock}
            >
              Löschen
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

const DAYS_IN_WEEK = 7;
export function getDaysOfWeekInInterval(
  dateA: Date,
  dateB: Date,
): ApiDayOfWeek[] {
  const dates = [dateA, dateB];
  const startDate = min(dates);
  const endDate = max(dates);
  const clampedEndDate = min([endDate, addDays(startDate, DAYS_IN_WEEK)]);

  return unique(
    eachDayOfInterval({ start: startDate, end: clampedEndDate }).map(
      (date) => WEEKDAY_CHECKBOX_OPTIONS[getDay(date)],
    ),
  )
    .filter(isDefined)
    .filter(({ disabled }) => !disabled)
    .map(({ id }) => id);
}
