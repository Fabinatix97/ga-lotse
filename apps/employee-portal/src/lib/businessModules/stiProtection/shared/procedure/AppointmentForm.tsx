/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UnfoldMore } from "@mui/icons-material";
import { Box, FormLabel, Stack, Typography } from "@mui/joy";
import { startOfHour } from "date-fns";
import { useFormikContext } from "formik";
import { useState } from "react";

import {
  APPOINTMENT_DURATION_MAX_LENGTH,
  APPOINTMENT_DURATION_MIN_LENGTH,
  CustomAppointmentQuickButtons,
  DateTimeField,
  RadioSheetOption,
  RadioSheets,
  validateAppointmentDuration,
  validateTodayOrFutureDate,
} from "@eshg/lib-employee-portal";
import {
  APPOINTMENT_PICKER_FIELD_LABELS_DE,
  AppointmentPickerField,
  NumberField,
  SingleAutocompleteField,
  ifDefined,
  mapOptionalValue,
} from "@eshg/lib-portal";
import {
  ApiAppointment,
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiConcern,
} from "@eshg/sti-protection-api";

import { useGetFreeAppointments } from "@/lib/businessModules/stiProtection/api/queries/appointmentBlocks";
import { appointmentOptionsByConcern } from "@/lib/businessModules/stiProtection/components/appointmentBlocks/options";
import { concernToAppointmentType } from "@/lib/businessModules/stiProtection/shared/helpers";

export interface CreateAppointmentForm {
  appointmentType?: ApiAppointmentType | "" | null;
  appointmentBookingType?: ApiAppointmentBookingType | "";
  blockAppointment?: null | ApiAppointment;
  concern?: ApiConcern | "RESULTS_REVIEW" | "";
  customAppointmentDate: string;
  customAppointmentDuration: string;
}

export const initialValues: CreateAppointmentForm = {
  appointmentType: null,
  appointmentBookingType: "",
  blockAppointment: null,
  concern: "",
  customAppointmentDate: "",
  customAppointmentDuration: "",
};

function ConnectedAppointmentPicker<TForm extends CreateAppointmentForm>({
  name,
  appointmentType,
}: {
  name: string;
  appointmentType: ApiAppointmentType | undefined;
}) {
  const {
    values: { blockAppointment },
  } = useFormikContext<TForm>();

  const initialMonth = blockAppointment?.start ?? null;
  const [currentMonth, setCurrentMonth] = useState(initialMonth ?? new Date());
  const now = new Date();
  const freeAppointments = useGetFreeAppointments({
    appointmentType,
    earliestDate: startOfHour(now),
  });
  const monthAppointments = freeAppointments.data ?? [];

  return (
    <Box
      sx={(theme) => ({
        background: "white",
        padding: 2,
        marginTop: 1,
        borderRadius: theme.radius.md,
        maxWidth: theme.spacing(46),
      })}
    >
      <AppointmentPickerField
        name={name}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        monthAppointments={monthAppointments}
        required
        labels={APPOINTMENT_PICKER_FIELD_LABELS_DE}
      />
    </Box>
  );
}

export function AppointmentForm<TForm extends CreateAppointmentForm>({
  startingConcern,
  editAppointmentType,
}: Readonly<{
  startingConcern?: ApiConcern;
  editAppointmentType?: ApiAppointmentType;
}>) {
  const { values } = useFormikContext<TForm>();

  const customSectionSelected =
    values.appointmentBookingType === ApiAppointmentBookingType.UserDefined;

  const appointmentType =
    editAppointmentType ??
    mapOptionalValue(values.appointmentType) ??
    ifDefined(mapOptionalValue(values.concern), concernToAppointmentType);

  const showAppointmentTypePicker =
    editAppointmentType === undefined && startingConcern !== undefined;

  return (
    <Stack gap={3}>
      {showAppointmentTypePicker ? (
        <AppointmentTypeField concern={startingConcern} />
      ) : null}
      <div>
        {showAppointmentTypePicker ? (
          <Typography level="body-md">Termin auswählen</Typography>
        ) : null}
        <RadioSheets
          name="appointmentBookingType"
          aria-label="Buchungsart"
          required="Bitte eine Buchungsart auswählen"
        >
          <RadioSheetOption
            name="appointmentBookingType"
            value={ApiAppointmentBookingType.AppointmentBlock}
            label="Aus Terminblock"
          >
            <ConnectedAppointmentPicker
              appointmentType={appointmentType}
              name="blockAppointment"
            />
          </RadioSheetOption>
          <RadioSheetOption
            label="Individueller Termin"
            name="appointmentBookingType"
            value={ApiAppointmentBookingType.UserDefined}
          >
            <Stack gap={1} mt={2}>
              <DateTimeField
                label="Datum und Zeit"
                name="customAppointmentDate"
                validate={validateTodayOrFutureDate}
                {...(customSectionSelected && {
                  required: "Datum eingeben",
                })}
              />
              <CustomAppointmentQuickButtons />
              <NumberField
                label="Termindauer in Minuten"
                name="customAppointmentDuration"
                min={APPOINTMENT_DURATION_MIN_LENGTH}
                max={APPOINTMENT_DURATION_MAX_LENGTH}
                validate={validateAppointmentDuration}
                {...(customSectionSelected && {
                  required: "Termindauer eingeben",
                })}
              />
            </Stack>
          </RadioSheetOption>
        </RadioSheets>
      </div>
    </Stack>
  );
}

function AppointmentTypeField({ concern }: Readonly<{ concern?: ApiConcern }>) {
  return (
    <SingleAutocompleteField
      label={
        <FormLabel>
          <Typography level="title-md">Terminart</Typography>
        </FormLabel>
      }
      name="appointmentType"
      required="Bitte eine Terminart auswählen"
      options={appointmentOptionsByConcern(concern)}
      popupIcon={<UnfoldMore />}
    />
  );
}
