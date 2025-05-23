/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormHelperText, Stack } from "@mui/joy";
import { useField } from "formik";
import { ReactNode, useMemo, useState } from "react";

import { DateTimeField } from "@eshg/lib-employee-portal";
import {
  AppointmentPickerField,
  NumberField,
  RadioGroupFieldProps,
  isDateCurrentDateOrGreater,
  isNonEmptyArray,
} from "@eshg/lib-portal";
import { FIELD_LABELS_DE } from "@eshg/lib-portal/components/formFields/appointmentPicker/labels";
import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
} from "@eshg/travel-medicine-api";

import { theme } from "@/lib/baseModule/theme/theme";
import { Appointment } from "@/lib/businessModules/travelMedicine/api/models/Appointment";
import {
  RadioSheet,
  RadioSheetOption,
} from "@/lib/businessModules/travelMedicine/shared/RadioSheet";
import {
  APPOINTMENT_DURATION_MAX_LENGTH,
  APPOINTMENT_DURATION_MIN_LENGTH,
  validateAppointmentDuration,
  validateTodayOrFutureDate,
} from "@/lib/shared/helpers/validators";

interface AppointmentRadioGroupProps extends RadioGroupFieldProps {
  type?: ApiAppointmentType;
  isCitizenFollowUp?: boolean;
  freeConsultationBlockAppointments: Appointment[];
  freeVaccinationBlockAppointments: Appointment[];
  appointmentInfo?: ReactNode;
}

export function AppointmentRadioGroup({
  isCitizenFollowUp = false,
  freeConsultationBlockAppointments,
  freeVaccinationBlockAppointments,
  ...props
}: Readonly<AppointmentRadioGroupProps>) {
  const [bookingTypeFieldProps] = useField("bookingType");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const freeAppointments =
    props.type == ApiAppointmentType.Consultation
      ? freeConsultationBlockAppointments
      : freeVaccinationBlockAppointments;

  const filteredAppointments = useMemo(
    () =>
      freeAppointments.filter((appointment) =>
        isDateCurrentDateOrGreater(appointment.start),
      ),
    [freeAppointments],
  );

  return (
    <Stack gap={2}>
      <RadioSheet
        label={props.label}
        name={props.name}
        required="Bitte einen Termintyp auswählen"
      >
        {props.appointmentInfo}
        <RadioSheetOption
          name={props.name}
          value={ApiAppointmentBookingType.AppointmentBlock}
          label="Aus Terminblock"
          disabled={!isNonEmptyArray(filteredAppointments)}
        >
          {!isNonEmptyArray(filteredAppointments) ? (
            <FormHelperText
              component="p"
              sx={{ m: 0, fontSize: theme.typography["body-sm"] }}
              aria-live="polite"
            >
              Keine freien Terminblöcke verfügbar
            </FormHelperText>
          ) : (
            <AppointmentPickerField
              name="appointmentBlockDate"
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              monthAppointments={filteredAppointments}
              required={
                bookingTypeFieldProps.value ===
                ApiAppointmentBookingType.AppointmentBlock
              }
              labels={FIELD_LABELS_DE}
            />
          )}
        </RadioSheetOption>
        <RadioSheetOption
          label="Individueller Termin"
          name={props.name}
          value={ApiAppointmentBookingType.UserDefined}
        >
          <Stack
            gap={1}
            sx={{ flexGrow: 1, m: 0, p: 0, border: 0 }}
            component="fieldset"
            aria-label="Individueller Termin Terminangaben"
          >
            <DateTimeField
              label="Datum und Uhrzeit"
              name="userDefinedAppointmentDate"
              validate={validateTodayOrFutureDate}
            />
            <NumberField
              label="Termindauer in Minuten"
              name="appointmentTypeStandardDuration"
              min={APPOINTMENT_DURATION_MIN_LENGTH}
              max={APPOINTMENT_DURATION_MAX_LENGTH}
              validate={validateAppointmentDuration}
            />
          </Stack>
        </RadioSheetOption>
        {isCitizenFollowUp && (
          <RadioSheetOption
            label="Selbstbucher"
            name={props.name}
            value={ApiAppointmentBookingType.SelfBooking}
          />
        )}
      </RadioSheet>
    </Stack>
  );
}
