/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import {
  Chip,
  FormControl,
  FormHelperText,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { endOfDay, isSameDay, isWithinInterval, startOfDay } from "date-fns";
import { useState } from "react";

import {
  AppointmentCalendar,
  MonthSelectionProps,
} from "./AppointmentCalendar";

export interface AppointmentPickerFieldProps extends MonthSelectionProps {
  name: string;
  sx?: SxProps;
  className?: string;
  required?: string | undefined;
  active?: boolean;
  monthAppointments: Date[];
  onAppointmentSelected?: (d: Date) => unknown;
}
export function AppointmentPickerField({
  sx,
  className,
  active,
  currentMonth,
  setCurrentMonth,
  monthAppointments,
  onAppointmentSelected,
  required,
  ...props
}: AppointmentPickerFieldProps) {
  const field = useBaseField<Date | undefined>({
    ...props,
    required: active ? required : undefined,
    type: "date",
  });
  // const { error, required } = field;
  const [selectedDay, setSelectedDayRaw] = useState<Date | undefined>(
    field.input.value,
  );

  function setSelectedDay(d: Date) {
    setSelectedDayRaw(d);
    if (!selectedDay || !isSameDay(d, selectedDay)) {
      void field.helpers.setValue(undefined);
    }
  }

  return (
    <Stack sx={sx} className={className}>
      <AppointmentCalendar
        selectedDay={active ? selectedDay : undefined}
        onDateSelected={setSelectedDay}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        monthAppointments={monthAppointments}
      />
      <FormControl error={field.error} required={field.required}>
        <AppointmentListForDate
          field={field}
          date={active ? selectedDay : undefined}
          onAppointmentSelected={onAppointmentSelected}
          monthAppointments={monthAppointments}
        />
        {active && field.helperText != null && (
          <FormHelperText>{field.helperText}</FormHelperText>
        )}
      </FormControl>
    </Stack>
  );
}

const timeForm = Intl.DateTimeFormat("de-DE", { timeStyle: "short" });
const dateFullForm = Intl.DateTimeFormat("de-DE", {
  month: "long",
  day: "numeric",
  weekday: "long",
  year: "numeric",
});
function AppointmentListForDate({
  date,
  field,
  monthAppointments,
  onAppointmentSelected,
}: {
  date: Date | undefined;
  field: ReturnType<typeof useBaseField<Date | undefined>>;
  monthAppointments: Date[];
  onAppointmentSelected?: (d: Date) => unknown;
}) {
  const currentInterval = date
    ? {
        start: startOfDay(date),
        end: endOfDay(date),
      }
    : undefined;
  const dayAppointments =
    currentInterval != null
      ? monthAppointments
          .filter((t) => isWithinInterval(t, currentInterval))
          .sort()
      : [];
  const hasAppointments = dayAppointments.length > 0;
  if (!hasAppointments || !date) {
    return null;
  }

  function createOnSelected(d: Date) {
    return () => {
      onAppointmentSelected?.(d);
      return field.helpers.setValue(d);
    };
  }

  return (
    <RadioGroup>
      <Typography level="title-md" my={2}>
        Uhrzeit
      </Typography>
      <List
        orientation="horizontal"
        wrap
        size="sm"
        sx={{ marginBottom: "16px", gap: "8px", padding: 0 }}
        aria-description={`Liste verfügbarer Termine für ${dateFullForm.format(date)}`}
      >
        {dayAppointments.map((t) => {
          const isSelected = field.input.value === t;
          return (
            <ListItem sx={{ padding: 0, minHeight: 0 }} key={t.toString()}>
              <Chip
                variant={isSelected ? "soft" : "plain"}
                color={isSelected ? "primary" : "neutral"}
                sx={{ minWidth: "56px", textAlign: "center" }}
              >
                <Radio
                  component={"time"}
                  dateTime={timeForm.format(t)}
                  disableIcon
                  overlay
                  name={`appointments-${date.getDate()}`}
                  value={t}
                  checked={field.input.value === t}
                  onChange={createOnSelected(t)}
                  label={timeForm.format(t)}
                />
              </Chip>
            </ListItem>
          );
        })}
      </List>
    </RadioGroup>
  );
}
