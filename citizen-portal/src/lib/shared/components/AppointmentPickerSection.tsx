/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppointmentListProps } from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentListForDate";
import {
  Appointment,
  AppointmentPickerField,
  AppointmentPickerFieldProps,
  AppointmentPickerLayoutProps,
} from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentPickerField";
import {
  formatTime,
  isSameAppointment,
} from "@eshg/lib-portal/components/formFields/appointmentPicker/helpers";
import {
  Box,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
  Theme,
  Typography,
  styled,
  useTheme,
} from "@mui/joy";
import assert from "assert";
import { useFormikContext } from "formik";
import { ChangeEvent, useCallback, useMemo, useState } from "react";

import { Row } from "@/lib/businessModules/measlesProtection/shared/components/Row";
import { TranslateFn } from "@/lib/i18n/client";
import { useLocale } from "@/lib/i18n/useLocale";

interface AppointmentPickerSectionProps<T extends Appointment> {
  name: string;
  translationPrefix?: string;
  t: TranslateFn;
  onAppointmentSelected?: (d: T) => unknown;
  onDateSelected?: (d: Date) => unknown;
  appointments: T[];
  autoSelectFirst?: boolean;
}

export function AppointmentPickerSection<T extends Appointment>({
  appointments,
  name,
  translationPrefix = "appointment_calendar",
  t,
  onAppointmentSelected,
  onDateSelected,
  autoSelectFirst = true,
}: AppointmentPickerSectionProps<T>) {
  const { value } = useFormikContext().getFieldMeta<T | undefined>(name);
  const startMonth =
    appointments
      .map((t) => t.start)
      .sort((a, b) => a.getTime() - b.getTime())[0] ?? new Date();
  const [month, setMonth] = useState<Date>(value?.start ?? startMonth);
  const { code } = useLocale();
  const labels = useMemo(
    () => ({
      requiredAppointment: t(`${translationPrefix}.required_appointment`),
      requiredDay: t(`${translationPrefix}.required_day`),
      monthSelection: t(`${translationPrefix}.month_selection`),
      nextMonth: t(`${translationPrefix}.next_month`),
      prevMonth: t(`${translationPrefix}.prev_month`),
      listLabel: t(`${translationPrefix}.list_label`),
      calendarLabel: t(`${translationPrefix}.calendar_label`),
      availableLegend: t(`${translationPrefix}.available`),
    }),
    [t, translationPrefix],
  );

  return (
    <AppointmentPickerField
      name={name}
      currentMonth={month}
      setCurrentMonth={setMonth}
      autoSelectFirst={autoSelectFirst ? true : undefined}
      monthAppointments={appointments}
      required={true}
      labels={labels}
      onAppointmentSelected={onAppointmentSelected}
      onDateSelected={onDateSelected}
      showWeekdays={["monday", "tuesday", "wednesday", "thursday", "friday"]}
      layout={AppointmentPickerCitizenLayout}
      padDays={false}
      appointmentList={TimeSlotList}
      slotProps={AppointmentPickerCitizenSlotProps}
      locale={code}
    />
  );
}

const AppointmentPickerCitizenSlotProps: AppointmentPickerFieldProps<Appointment>["slotProps"] =
  {
    calendar: {
      monthSelection: {
        arrows: {
          variant: "soft",
          sx: { backgroundColor: "white" },
        },
      },
    },
  };

function AppointmentPickerCitizenLayout({
  calendar,
  calendarError,
  appointmentList,
  labels: { calendarLabel, availableLegend },
}: AppointmentPickerLayoutProps) {
  if (!calendarLabel) {
    throw Error("Calendar Label not defined");
  }
  if (!availableLegend) {
    throw Error("Available Legend not defined");
  }
  return (
    <Row gap={3}>
      <Stack gap={2}>
        <Typography level="title-md">{calendarLabel}</Typography>
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.background.level1,
            padding: 2,
            borderRadius: theme.radius.md,
            alignSelf: "start",
            maxWidth: theme.spacing(41),
          })}
        >
          {calendar}
        </Box>
        <AvailableLegend label={availableLegend} />
        {calendarError}
      </Stack>
      {appointmentList}
    </Row>
  );
}

const ListGrid = styled("ol")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: theme.spacing(2),
  margin: 0,
  padding: 0,
}));

function TimeSlotList<T extends Appointment>({
  date,
  field,
  appointments,
  onAppointmentSelected,
  label,
  locale,
}: AppointmentListProps<T>) {
  const onSelected = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const date = appointments[parseInt(value)];
      assert.ok(date);
      onAppointmentSelected?.(date);
      return field.helpers.setValue(date);
    },
    [field.helpers, appointments, onAppointmentSelected],
  );

  const hasAppointments = appointments.length > 0;
  if (!hasAppointments || !date) {
    return null;
  }

  return (
    <Stack gap={2} data-testid={"time-slot-list"}>
      <Typography level="title-md">{label}</Typography>
      <RadioGroup onChange={onSelected}>
        <ListGrid>
          {appointments.map((apt: T, index: number) => (
            <TimeSlot
              key={index}
              index={index}
              appointment={apt}
              value={field.meta.value}
              locale={locale}
            />
          ))}
        </ListGrid>
      </RadioGroup>
    </Stack>
  );
}

function TimeSlot<T extends Appointment>({
  value,
  appointment,
  index,
  locale,
}: {
  value: T | null;
  appointment: T;
  index: number;
  locale: string;
}) {
  const theme = useTheme();
  const isSelected = isSameAppointment(value, appointment);
  const label = formatTime(appointment.start, locale);
  const radioButtonSlotProps = useRadioButtonSlotProps(theme, isSelected);
  const labelFontStyles = useLabelFontStyles(theme, isSelected);
  return (
    <ListItem sx={{ padding: 0, minHeight: 0 }}>
      <Box
        component="time"
        sx={{ width: "100%" }}
        dateTime={appointment.start.toTimeString().slice(0, 5)}
      >
        <Radio
          disableIcon
          overlay
          slotProps={radioButtonSlotProps}
          color="primary"
          checked={isSelected}
          value={index}
          label={
            <Typography level="title-md" sx={labelFontStyles}>
              {label}
            </Typography>
          }
        />
      </Box>
    </ListItem>
  );
}

function useLabelFontStyles(theme: Theme, isSelected: boolean) {
  return useMemo(
    () => ({
      color: isSelected ? "white" : theme.palette.primary.plainColor,
      ".MuiListItem-root:hover &": {
        color: isSelected ? "white" : theme.palette.primary.plainColor,
      },
      fontSize: theme.fontSize.md,
      fontWeight: 600,
    }),
    [theme, isSelected],
  );
}

function useRadioButtonSlotProps(theme: Theme, isSelected: boolean) {
  return useMemo(
    () => ({
      action: {
        sx: {
          border: "none",
          backgroundColor: isSelected
            ? theme.palette.primary.solidBg
            : theme.palette.neutral.softBg,
          "&:hover": {
            backgroundColor: isSelected
              ? theme.palette.primary.solidHoverBg
              : theme.palette.neutral.softHoverBg,
          },
          borderRadius: theme.radius.md,
          display: "flex",
          justifyContent: "center",
        },
      },
      label: {
        sx: {
          padding: theme.spacing(1),
          textAlign: "center",
        },
      },
      root: {
        sx: {
          width: "100%",
        },
      },
    }),
    [theme, isSelected],
  );
}

function AvailableLegend({ label }: { label: string }) {
  return (
    <Row alignItems="center" marginLeft={2}>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.plainColor,
          width: theme.spacing(1),
          height: theme.spacing(0.5),
          borderRadius: theme.radius.xs,
        })}
      />
      {label}
    </Row>
  );
}
