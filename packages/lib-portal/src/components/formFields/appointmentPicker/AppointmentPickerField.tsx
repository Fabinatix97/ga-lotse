/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormControl, FormHelperText, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isSameDay } from "date-fns";
import { useFormikContext } from "formik";
import {
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { isDate } from "remeda";

import { getPropertyIf } from "../../../helpers/getProperty";
import { useHasChanged } from "../../../hooks/useHasChanged";
import { useBaseField } from "../BaseField";

import {
  AppointmentCalendar,
  AppointmentCalendarProps,
  MonthSelectionPassThroughProps,
} from "./AppointmentCalendar";
import {
  AppointmentListForDate,
  AppointmentListLabelType,
  AppointmentListProps,
  useAppointmentList,
} from "./AppointmentListForDate";
import { Weekday, formatAppointmentTime } from "./helpers";

export interface Appointment {
  start: Date;
  end?: Date;
}

export interface AppointmentPickerLayoutProps {
  calendar: ReactNode;
  calendarError?: ReactNode;
  appointmentList: ReactNode;
  sx?: SxProps;
  className?: string;
  labels: AppointmentPickerFieldLabels;
  locale: string;
}

export interface AppointmentPickerFieldLabels {
  listLabel: AppointmentListLabelType;
  monthSelection: string;
  nextMonth: string;
  prevMonth: string;
  requiredDay: string;
  requiredAppointment: string;
  calendarLabel?: string;
  availableLegend?: string;
}

export interface AppointmentPickerFieldProps<T extends Appointment>
  extends Omit<MonthSelectionPassThroughProps, "locale"> {
  name: string;
  sx?: SxProps;
  required?: boolean;
  className?: string;
  active?: boolean;
  monthAppointments: T[];
  onAppointmentSelected?: (d: T) => unknown;
  onDateSelected?: (d: Date) => unknown;
  isAppointmentEqual?: (apt1: T, apt2: T) => boolean;
  layout?: (props: AppointmentPickerLayoutProps) => ReactNode;
  appointmentList?: (props: AppointmentListProps<T>) => ReactNode;
  labels: AppointmentPickerFieldLabels;
  showWeekdays?: Weekday[];
  padDays?: boolean;
  autoSelectFirst?: true;
  slotProps?: {
    calendar?: AppointmentCalendarProps["slotProps"];
    list?: {
      trimLeadingZero?: boolean | undefined;
    };
  };
  locale?: string | undefined;
}

export function AppointmentPickerField<T extends Appointment>({
  sx,
  className,
  active = true,
  currentMonth,
  setCurrentMonth,
  monthAppointments: givenMonthAppointments,
  onAppointmentSelected,
  isAppointmentEqual,
  required,
  appointmentList: AppointmentListOverride,
  layout,
  labels,
  showWeekdays,
  slotProps,
  padDays,
  onDateSelected,
  autoSelectFirst,
  locale = "de-DE",
  ...props
}: AppointmentPickerFieldProps<T>) {
  const {
    listLabel,
    monthSelection: monthSelectionLabel,
    nextMonth: nextMonthLabel,
    prevMonth: prevMonthLabel,
    requiredDay: requiredDayWarning,
    requiredAppointment: requiredAppointmentWarning,
  } = labels;
  const { getFieldMeta, getFieldHelpers } = useFormikContext();
  const { value, error } = getFieldMeta(props.name);
  const { setValue } = getFieldHelpers(props.name);
  const start = getPropertyIf(value, "start", isDate);
  const [selectedDay, setSelectedDayRaw] = useState<Date | undefined>(start);
  const requiredWarning =
    selectedDay === undefined ? requiredDayWarning : requiredAppointmentWarning;
  const field = useBaseField<T | null>({
    ...props,
    required: active && required ? requiredWarning : undefined,
  });

  // formik will not re-validate when the validate prop changes.
  const requiredWarningChanged = useHasChanged(requiredWarning);
  useEffect(() => {
    if (requiredWarningChanged) {
      void field.helpers.setTouched(field.meta.touched, true);
    }
  }, [requiredWarningChanged, field.meta.touched, field.helpers]);

  const monthAppointments = useMemo(
    () =>
      givenMonthAppointments.sort(
        (a, b) => a.start.getTime() - b.start.getTime(),
      ),
    [givenMonthAppointments],
  );

  const listProps = useAppointmentList({
    selectedDay,
    monthAppointments,
    listLabel,
    locale,
  });

  const setSelectedDay = useCallback(
    (d: Date) => {
      setSelectedDayRaw(d);
      if (!selectedDay || !isSameDay(d, selectedDay)) {
        void field.helpers.setValue(null);
      }
      onDateSelected?.(d);
    },
    [selectedDay, field.helpers, onDateSelected, setSelectedDayRaw],
  );

  // When "auto-select first" is on
  // auto-select the first appointment in the list
  useEffect(() => {
    const appt = monthAppointments[0];
    if (
      autoSelectFirst === undefined ||
      selectedDay !== undefined ||
      appt === undefined
    ) {
      return;
    }
    setSelectedDayRaw(appt.start);
    onDateSelected?.(appt.start);
    void setValue(appt);
    onAppointmentSelected?.(appt);
  }, [
    selectedDay,
    setValue,
    monthAppointments,
    autoSelectFirst,
    onDateSelected,
    onAppointmentSelected,
  ]);

  const dateAppointments = monthAppointments.map((t) => t.start);
  const Layout = layout ?? DefaultLayout;
  const AppointmentList = AppointmentListOverride ?? AppointmentListForDate;
  const calendarErrorId = useId();
  const hasCalendarError = selectedDay === undefined && error;
  const calendarError = hasCalendarError ? (
    <FormHelperText
      component="p"
      sx={(theme) => ({ my: 1, color: theme.palette.danger.plainColor })}
      id={calendarErrorId}
      aria-live="polite"
    >
      {error}
    </FormHelperText>
  ) : undefined;

  return (
    <Layout
      className={className}
      sx={sx}
      labels={labels}
      calendar={
        <AppointmentCalendar
          selectedDay={active ? selectedDay : undefined}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          appointments={dateAppointments}
          monthSelectionLabel={monthSelectionLabel}
          nextMonthLabel={nextMonthLabel}
          prevMonthLabel={prevMonthLabel}
          showWeekdays={showWeekdays}
          slotProps={slotProps?.calendar}
          padDays={padDays}
          errorMessageId={hasCalendarError ? calendarErrorId : undefined}
          locale={locale}
          onDateSelected={setSelectedDay}
        />
      }
      locale={locale}
      calendarError={calendarError}
      appointmentList={
        <FormControl
          error={field.error}
          required={field.required}
          sx={{ flex: 1 }}
        >
          <AppointmentList
            {...listProps}
            field={field}
            date={active ? selectedDay : undefined}
            isAppointmentEqual={isAppointmentEqual}
            optionLabel={(a, l) =>
              formatAppointmentTime(
                a.start,
                l,
                slotProps?.list?.trimLeadingZero,
              )
            }
            locale={locale}
            onAppointmentSelected={onAppointmentSelected}
          />
          {field.helperText !== undefined &&
            (field.helperText !== error || !hasCalendarError) && (
              <FormHelperText component="p" sx={{ my: 1 }} aria-live="polite">
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
  calendarError,
  appointmentList,
}: AppointmentPickerLayoutProps) {
  const givenSx = sx === undefined ? [] : sx instanceof Array ? sx : [sx];
  const sxProps = [{ margin: 0, padding: 0, border: 0 }, ...givenSx];
  return (
    <Stack
      component="fieldset"
      sx={sxProps}
      className={className}
      aria-label="Terminkalender"
    >
      {calendar}
      {calendarError}
      {appointmentList}
    </Stack>
  );
}
