/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormControl, FormHelperText, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isSameDay } from "date-fns";
import { useFormikContext } from "formik";
import { ReactNode, useState } from "react";

import { useBaseField } from "../BaseField";

import {
  AppointmentCalendar,
  MonthSelectionPassThroughProps,
} from "./AppointmentCalendar";
import {
  AppointmentListDescriptionType,
  AppointmentListForDate,
  AppointmentListProps,
  useAppointmentList,
} from "./AppointmentListForDate";

export { FIELD_LABELS_DE } from "./labels";

export interface Appointment {
  start: Date;
}

export interface AppointmentPickerLayoutProps {
  calendar: ReactNode;
  appointmentList: ReactNode;
  sx?: SxProps;
  className?: string;
}

export interface AppointmentPickerFieldLabels {
  listDescription: AppointmentListDescriptionType;
  listLabel: string;
  monthSelection: string;
  nextMonth: string;
  prevMonth: string;
  requiredDay: string;
  requiredAppointment: string;
}

export interface AppointmentPickerFieldProps<T extends Appointment>
  extends MonthSelectionPassThroughProps {
  name: string;
  sx?: SxProps;
  required?: boolean;
  className?: string;
  active?: boolean;
  monthAppointments: T[];
  onAppointmentSelected?: (d: T) => unknown;
  layout?: (props: AppointmentPickerLayoutProps) => ReactNode;
  appointmentList?: (props: AppointmentListProps<T>) => ReactNode;
  labels: AppointmentPickerFieldLabels;
}
export function AppointmentPickerField<T extends Appointment>({
  sx,
  className,
  active = true,
  currentMonth,
  setCurrentMonth,
  monthAppointments,
  onAppointmentSelected,
  required,
  appointmentList: AppointmentListOverride,
  layout,
  labels,
  ...props
}: AppointmentPickerFieldProps<T>) {
  const {
    listDescription,
    listLabel,
    monthSelection: monthSelectionLabel,
    nextMonth: nextMonthLabel,
    prevMonth: prevMonthLabel,
    requiredDay: requiredDayWarning,
    requiredAppointment: requiredAppointmentWarning,
  } = labels;
  const { initialValues } = useFormikContext<{ [K in string]: T }>();
  const [selectedDay, setSelectedDayRaw] = useState<Date | undefined>(
    initialValues[props.name]?.start,
  );
  const requiredWarning =
    selectedDay == null ? requiredDayWarning : requiredAppointmentWarning;
  const field = useBaseField<T | null>({
    ...props,
    required: active && required ? requiredWarning : undefined,
  });

  const listProps = useAppointmentList({
    selectedDay,
    monthAppointments,
    listDescription,
  });

  function setSelectedDay(d: Date) {
    setSelectedDayRaw(d);
    if (!selectedDay || !isSameDay(d, selectedDay)) {
      void field.helpers.setValue(null);
    }
  }

  const dateAppointments = monthAppointments.map((t) => t.start);

  const Layout = layout ?? DefaultLayout;
  const AppointmentList = AppointmentListOverride ?? AppointmentListForDate;

  return (
    <Layout
      className={className}
      sx={sx}
      calendar={
        <AppointmentCalendar
          selectedDay={active ? selectedDay : undefined}
          onDateSelected={setSelectedDay}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          appointments={dateAppointments}
          monthSelectionLabel={monthSelectionLabel}
          nextMonthLabel={nextMonthLabel}
          prevMonthLabel={prevMonthLabel}
        />
      }
      appointmentList={
        <FormControl error={field.error} required={field.required}>
          <AppointmentList
            {...listProps}
            field={field}
            date={active ? selectedDay : undefined}
            onAppointmentSelected={onAppointmentSelected}
            label={listLabel}
          />
          {field.helperText != null && (
            <FormHelperText component="p" sx={{ my: 1 }}>
              {field.helperText}
            </FormHelperText>
          )}
        </FormControl>
      }
    />
  );
}

function DefaultLayout({
  sx,
  className,
  calendar,
  appointmentList,
}: AppointmentPickerLayoutProps) {
  return (
    <Stack sx={sx} className={className}>
      {calendar}
      {appointmentList}
    </Stack>
  );
}
