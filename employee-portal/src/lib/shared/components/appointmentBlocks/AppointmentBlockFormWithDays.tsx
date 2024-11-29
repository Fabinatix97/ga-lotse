/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiDayOfWeek } from "@eshg/employee-portal-api/measlesProtection";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { NestedFormProps } from "@eshg/lib-portal/types/form";
import { EnumMap } from "@eshg/lib-portal/types/helpers";
import { Delete } from "@mui/icons-material";
import { Button, Grid } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { WeekdayCheckboxGroup } from "@/lib/shared/components/appointmentBlocks/WeekdayCheckboxGroup";
import { TimeField } from "@/lib/shared/components/formFields/TimeField";
import { validateTodayOrFutureDate } from "@/lib/shared/helpers/validators";

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

export interface AppointmentBlockFormWithDaysProps extends NestedFormProps {
  removeBlock: () => void;
  blockCount: number;
}

export function AppointmentBlockFormWithDays(
  props: Readonly<AppointmentBlockFormWithDaysProps>,
) {
  const fieldName = createFieldNameMapper(props.name);
  const daysOfWeekOptions = WEEKDAY_CHECKBOX_OPTIONS.filter(
    ({ disabled }) => !disabled,
  );

  return (
    <Grid direction="column" xs={10} paddingTop={0}>
      <Grid container xs={12} direction={"row"} columnGap={0}>
        <Grid xs={2} sx={{ ...dateTimeFieldStyle, pl: 0 }}>
          <DateField
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
      <Grid container xs={12} direction={"row"} paddingLeft={0}>
        <Grid direction={"column"}>
          <WeekdayCheckboxGroup
            name={fieldName("daysOfWeek")}
            options={daysOfWeekOptions}
            label={"Wochentage"}
            sx={{ mt: 1 }}
          />
        </Grid>
      </Grid>
      {props.blockCount > 1 && (
        <Grid container xs={12} direction={"row"} padding={0}>
          <Grid direction={"column"}>
            <Button
              variant="outlined"
              startDecorator={<Delete />}
              title="Terminblock entfernen"
              onClick={props.removeBlock}
              color="danger"
            >
              Löschen
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
