/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { RadioGroupFieldProps } from "@eshg/lib-portal/components/formFields/RadioGroupField";
import {
  AppointmentPickerField,
  FIELD_LABELS_DE,
} from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentPickerField";
import { isDateCurrentDateOrGreater } from "@eshg/lib-portal/helpers/dateTime";
import { isNonEmptyArray } from "@eshg/lib-portal/helpers/guards";
import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
} from "@eshg/travel-medicine-api";
import { FormHelperText, Stack } from "@mui/joy";
import { useField } from "formik";
import { ReactNode, useMemo, useState } from "react";

import { theme } from "@/lib/baseModule/theme/theme";
import { Appointment } from "@/lib/businessModules/travelMedicine/api/models/Appointment";
import {
  RadioSheet,
  RadioSheetOption,
} from "@/lib/businessModules/travelMedicine/shared/RadioSheet";
import { DateTimeField } from "@/lib/shared/components/formFields/DateTimeField";
import {
  validateNonNegativeInteger,
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
              name={"userDefinedAppointmentDate"}
              validate={validateTodayOrFutureDate}
            />
            <NumberField
              label="Termindauer in Minuten"
              name={"appointmentTypeStandardDuration"}
              min={0}
              validate={validateNonNegativeInteger}
            ></NumberField>
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
