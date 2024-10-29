/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
} from "@eshg/employee-portal-api/travelMedicine";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Stack, Typography } from "@mui/joy";
import { useField } from "formik";
import { isEmpty } from "remeda";

import { Appointment } from "@/lib/businessModules/travelMedicine/api/models/Appointment";
import { SelectableCard } from "@/lib/shared/components/cards/SelectableCard";
import { DateTimeField } from "@/lib/shared/components/formFields/DateTimeField";
import { RadioGroupField } from "@/lib/shared/components/formFields/RadioGroupField";
import { durationBetweenDatesInMinutes } from "@/lib/shared/helpers/dateTime";

interface AppointmentRadioGroupProps {
  type?: ApiAppointmentType;
  appointmentBlockDateOption?: SelectOption;
  required?: boolean;
  isCitizenFollowUp?: boolean;
  freeConsultationBlockAppointments: Appointment[];
  freeVaccinationBlockAppointments: Appointment[];
}

export function AppointmentRadioGroup({
  required = true,
  isCitizenFollowUp = false,
  freeConsultationBlockAppointments,
  freeVaccinationBlockAppointments,
  ...props
}: Readonly<AppointmentRadioGroupProps>) {
  function createAppointmentOptions(availableBlockAppointments: Appointment[]) {
    if (availableBlockAppointments) {
      let needToAddOption = true;
      const labelOptions: SelectOption[] = availableBlockAppointments.map(
        (blockAppointment) => {
          const label = formatDateTime(blockAppointment.start) + " Uhr";
          if (label == props.appointmentBlockDateOption?.label) {
            needToAddOption = false;
          }
          return {
            label: label,
            value:
              blockAppointment.start.toISOString() +
              "," +
              durationBetweenDatesInMinutes(
                blockAppointment.start,
                blockAppointment.end,
              ),
          };
        },
      );
      if (props.appointmentBlockDateOption && needToAddOption) {
        labelOptions.push(props.appointmentBlockDateOption);
      }

      return labelOptions;
    } else {
      return [];
    }
  }
  const [bookingTypeFieldProps] = useField("bookingType");

  return (
    <Stack gap={2}>
      <Typography level="body-md" sx={{ fontWeight: "bold", mt: 2 }}>
        Termin
      </Typography>
      <RadioGroupField
        name="bookingType"
        required={required ? "Bitte einen Termintyp auswählen" : undefined}
      >
        <SelectableCard
          key={ApiAppointmentBookingType.AppointmentBlock}
          value={ApiAppointmentBookingType.AppointmentBlock}
          sx={{ mb: 2 }}
          radioProps={{ overlay: false }}
          allowDeselection={!required}
          forGroupName="bookingType"
        >
          {props.type == ApiAppointmentType.Consultation ? (
            <SelectField
              label="Termin aus Terminblock"
              name="appointmentBlockDate"
              options={createAppointmentOptions(
                freeConsultationBlockAppointments,
              )}
              sx={{ flexGrow: 1 }}
            />
          ) : (
            <SelectField
              label="Termin aus Terminblock"
              name="appointmentBlockDate"
              options={createAppointmentOptions(
                freeVaccinationBlockAppointments,
              )}
              sx={{ flexGrow: 1 }}
            />
          )}
        </SelectableCard>
        <SelectableCard
          key={ApiAppointmentBookingType.UserDefined}
          value={ApiAppointmentBookingType.UserDefined}
          sx={{ mb: 2 }}
          radioProps={{ overlay: false }}
          allowDeselection={!required}
          forGroupName={"bookingType"}
        >
          <Stack gap={2} sx={{ flexGrow: 1 }}>
            <DateTimeField
              label={"Individueller Termin"}
              name={"userDefinedAppointmentDate"}
              allowEmpty={
                (!required && isEmpty(bookingTypeFieldProps.value)) ||
                bookingTypeFieldProps.value ===
                  ApiAppointmentBookingType.UserDefined ||
                (!required &&
                  bookingTypeFieldProps.value !==
                    ApiAppointmentBookingType.UserDefined) ||
                (required &&
                  bookingTypeFieldProps.value !==
                    ApiAppointmentBookingType.UserDefined)
              }
            ></DateTimeField>
            <NumberField
              label={"Termin Dauer in Min."}
              name={"appointmentTypeStandardDuration"}
            ></NumberField>
          </Stack>
        </SelectableCard>
        {isCitizenFollowUp && (
          <SelectableCard
            key={ApiAppointmentBookingType.SelfBooking}
            value={ApiAppointmentBookingType.SelfBooking}
            sx={{ mb: 2 }}
            radioProps={{ overlay: false }}
            allowDeselection={!required}
            forGroupName={"bookingType"}
          >
            <Stack gap={2} sx={{ flexGrow: 1 }}>
              <Typography>Selbstbucher</Typography>
            </Stack>
          </SelectableCard>
        )}
      </RadioGroupField>
    </Stack>
  );
}
