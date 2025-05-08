/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Chip,
  ChipProps,
  Divider,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from "@mui/joy";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
import { useCallback, useId, useMemo } from "react";

import { ifDefined } from "../../../helpers/ifDefined";
import { useBaseField } from "../BaseField";

import { Appointment } from "./AppointmentPickerField";
import { formatTime } from "./helpers";

export type AppointmentListLabelType =
  | ((date: Date, locale: string) => string)
  | string;

interface UseAppointmentListProps<T extends Appointment> {
  selectedDay: Date | undefined;
  monthAppointments: T[];
  listLabel: AppointmentListLabelType;
  locale: string;
}
export function useAppointmentList<T extends Appointment>({
  selectedDay,
  monthAppointments,
  listLabel,
  locale,
}: UseAppointmentListProps<T>): { appointments: T[]; label: string } {
  const stringListLabel =
    typeof listLabel === "function"
      ? (ifDefined(selectedDay, (d) => listLabel(d, locale)) ?? "")
      : listLabel;

  return useMemo(() => {
    const currentDayInterval = selectedDay
      ? {
          start: startOfDay(selectedDay),
          end: endOfDay(selectedDay),
        }
      : undefined;

    const dayAppointments =
      currentDayInterval != null
        ? monthAppointments
            .filter((t) => isWithinInterval(t.start, currentDayInterval))
            .sort()
        : [];

    return {
      label: stringListLabel,
      appointments: dayAppointments,
    };
  }, [stringListLabel, selectedDay, monthAppointments]);
}

export interface AppointmentListProps<T extends Appointment> {
  date: Date | undefined;
  field: ReturnType<typeof useBaseField<T | null>>;
  appointments: T[];
  onAppointmentSelected?: (d: T) => unknown;
  isAppointmentEqual?: (apt1: T, apt2: T) => boolean;
  label: string;
  locale: string;
}
function defaultOptionLabel<T extends Appointment>(apt: T, locale: string) {
  return formatTime(apt.start, locale);
}
export function AppointmentListForDate<T extends Appointment>({
  date,
  field,
  appointments,
  onAppointmentSelected,
  isAppointmentEqual = (apt1, apt2) => apt1 === apt2,
  label,
  slotProps,
  locale,
  optionLabel = defaultOptionLabel,
}: AppointmentListProps<T> & {
  slotProps?: {
    chip?: Omit<ChipProps, "variant" | "color">;
  };
  optionLabel?: (appointment: T, locale: string) => string;
}) {
  const theme = useTheme();
  const labelId = useId();

  const createOnSelected = useCallback(
    (d: T) => {
      return () => {
        onAppointmentSelected?.(d);
        return field.helpers.setValue(d);
      };
    },
    [onAppointmentSelected, field.helpers],
  );

  const hasAppointments = appointments.length > 0;
  if (!hasAppointments || !date) {
    return null;
  }

  const { sx: chipSx, ...otherChipProps } = slotProps?.chip ?? {};

  return (
    <RadioGroup>
      <Divider sx={{ my: 2 }} />
      <Typography component="label" my={2} id={labelId}>
        <Typography component="span" level="title-md">
          {label}
        </Typography>
      </Typography>
      <List
        aria-describedby={labelId}
        orientation="horizontal"
        wrap
        size="sm"
        sx={{
          marginBottom: theme.spacing(2),
          gap: theme.spacing(1),
          padding: 0,
        }}
      >
        {appointments.map((apt) => {
          const isSelected =
            !!field.input.value && isAppointmentEqual(field.input.value, apt);
          return (
            <ListItem
              key={apt.start.getTime()}
              sx={{ padding: 0, minHeight: 0 }}
            >
              <Chip
                variant={isSelected ? "solid" : "soft"}
                color="primary"
                sx={{
                  minWidth: "4.7rem",
                  textAlign: "center",
                  paddingX: theme.spacing(2),
                  paddingY: theme.spacing(0.25),
                  gap: theme.spacing(1),
                  ...chipSx,
                }}
                {...otherChipProps}
              >
                <Radio
                  disableIcon
                  overlay
                  variant={isSelected ? "solid" : "soft"}
                  slotProps={{
                    action: {
                      sx: { border: "none" },
                    },
                  }}
                  value={apt.start}
                  color="primary"
                  checked={isSelected}
                  label={
                    <Typography
                      component="time"
                      dateTime={apt.start.toTimeString().slice(0, 5)}
                      level="title-md"
                      sx={{
                        color: isSelected
                          ? "white"
                          : theme.palette.primary.solidBg,
                        fontSize: theme.fontSize.md,
                        fontWeight: theme.fontWeight.md,
                      }}
                    >
                      {optionLabel(apt, locale)}
                    </Typography>
                  }
                  onChange={createOnSelected(apt)}
                />
              </Chip>
            </ListItem>
          );
        })}
      </List>
    </RadioGroup>
  );
}
