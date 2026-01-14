/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormHelperText, Stack } from "@mui/joy";
import { useField } from "formik";
import { ReactNode, useMemo, useState } from "react";

import {
  APPOINTMENT_DURATION_MAX_LENGTH,
  APPOINTMENT_DURATION_MIN_LENGTH,
  DateTimeField,
  validateAppointmentDuration,
  validateTodayOrFutureDate,
} from "@eshg/lib-employee-portal";
import {
  APPOINTMENT_PICKER_FIELD_LABELS_DE,
  AppointmentPickerField,
  NumberField,
  RadioGroupFieldProps,
  isDateCurrentDateOrGreater,
  isNonEmptyArray,
} from "@eshg/lib-portal";
import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
} from "@eshg/travel-medicine-api";

import { theme } from "@/lib/baseModule/theme/theme";
import { Appointment } from "@/lib/businessModules/travelMedicine/api/models/Appointment";
import {
  RadioAccordionGroupField,
  RadioAccordionItem,
} from "@/lib/shared/components/formFields/RadioAccordionField";

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
    props.type === ApiAppointmentType.Consultation
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
    <RadioAccordionGroupField
      name={props.name}
      label={props.label}
      required="Bitte einen Termintyp auswählen"
      data-testid="booking-type-radio-control"
    >
      {props.appointmentInfo}
      <RadioAccordionItem
        value={ApiAppointmentBookingType.AppointmentBlock}
        label="Aus Terminblock"
        disabled={!isNonEmptyArray(filteredAppointments)}
      >
        {(isExpanded) =>
          !isNonEmptyArray(filteredAppointments) ? (
            <FormHelperText
              component="p"
              sx={{ m: 0, fontSize: theme.typography["body-sm"] }}
              aria-live="polite"
            >
              Keine freien Terminblöcke verfügbar
            </FormHelperText>
          ) : (
            <AppointmentPickerField
              name="blockAppointment"
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              monthAppointments={filteredAppointments}
              required={
                isExpanded &&
                bookingTypeFieldProps.value ===
                  ApiAppointmentBookingType.AppointmentBlock
              }
              labels={APPOINTMENT_PICKER_FIELD_LABELS_DE}
            />
          )
        }
      </RadioAccordionItem>
      <RadioAccordionItem
        label="Individueller Termin"
        value={ApiAppointmentBookingType.UserDefined}
      >
        {(isExpanded) => (
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
              required={
                isExpanded ? "Datum und Zeit sind erforderlich" : undefined
              }
            />
            <NumberField
              label="Termindauer in Minuten"
              name="appointmentTypeStandardDuration"
              min={APPOINTMENT_DURATION_MIN_LENGTH}
              max={APPOINTMENT_DURATION_MAX_LENGTH}
              validate={validateAppointmentDuration}
              required={isExpanded ? "Termindauer ist erforderlich" : undefined}
            />
          </Stack>
        )}
      </RadioAccordionItem>
      {isCitizenFollowUp && (
        <RadioAccordionItem
          sx={{ "& .MuiAccordionDetails-root": { height: 0 } }}
          value={ApiAppointmentBookingType.SelfBooking}
          label="Selbstbucher"
        />
      )}
    </RadioAccordionGroupField>
  );
}
