/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UnfoldMore } from "@mui/icons-material";
import { Box, Button, FormLabel, Stack, Typography } from "@mui/joy";
import { addMinutes, startOfHour } from "date-fns";
import { useFormikContext } from "formik";
import { useState } from "react";

import { DateTimeField } from "@eshg/lib-employee-portal";
import { Row } from "@eshg/lib-portal/components/Row";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import {
  AppointmentPickerField,
  FIELD_LABELS_DE,
} from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentPickerField";
import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { ifDefined } from "@eshg/lib-portal/helpers/ifDefined";
import {
  ApiAppointment,
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiConcern,
} from "@eshg/sti-protection-api";

import { useGetFreeAppointments } from "@/lib/businessModules/stiProtection/api/queries/appointmentBlocks";
import {
  RadioSheetOption,
  RadioSheets,
} from "@/lib/businessModules/stiProtection/components/RadioSheets";
import { appointmentOptionsByConcern } from "@/lib/businessModules/stiProtection/components/appointmentBlocks/options";
import { concernToAppointmentType } from "@/lib/businessModules/stiProtection/shared/helpers";
import {
  validateNonNegativeInteger,
  validateTodayOrFutureDate,
} from "@/lib/shared/helpers/validators";

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
        required={true}
        labels={FIELD_LABELS_DE}
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
    editAppointmentType == null && startingConcern != null;

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
                required={
                  customSectionSelected ? "Bitte ein Datum eingeben" : undefined
                }
              />
              <CustomAppointmentQuickButtons />
              <NumberField
                label="Termindauer in Minuten"
                name="customAppointmentDuration"
                min={0}
                validate={validateNonNegativeInteger}
                required={
                  customSectionSelected ? "Bitte ein Dauer eingeben" : undefined
                }
              />
            </Stack>
          </RadioSheetOption>
        </RadioSheets>
      </div>
    </Stack>
  );
}

function CustomAppointmentQuickButtons<TForm>() {
  const { setFieldValue } = useFormikContext<TForm>();
  function setCustomAppointment(inMinutes: number) {
    const now = new Date();
    const roundTo = 5;
    const roundMinutes = now.getMinutes() % roundTo;
    const minutesToAdd =
      inMinutes > 0 ? inMinutes - roundMinutes : roundTo - roundMinutes;
    const customTime = addMinutes(now, minutesToAdd - now.getTimezoneOffset());
    void setFieldValue(
      "customAppointmentDate",
      customTime.toISOString().slice(0, 16),
    );
  }

  return (
    <Row mb={2} justifyContent="right">
      <Button
        title="Individueller Termin in den nächsten Minuten setzen"
        onClick={() => setCustomAppointment(0)}
        size="sm"
        variant="soft"
      >
        Jetzt
      </Button>
      <Button
        title="Individueller Termin in ca. 10 Minuten setzen"
        onClick={() => setCustomAppointment(10)}
        size="sm"
        variant="soft"
      >
        in 10m
      </Button>
      <Button
        title="Individueller Termin in ca. 20 Minuten setzen"
        onClick={() => setCustomAppointment(20)}
        size="sm"
        variant="soft"
      >
        in 20m
      </Button>
      <Button
        title="Individueller Termin in ca. 30 Minuten setzen"
        onClick={() => setCustomAppointment(30)}
        size="sm"
        variant="soft"
      >
        in 30m
      </Button>
    </Row>
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
