/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiStiProtectionProcedure,
} from "@eshg/employee-portal-api/stiProtection";
import { Row } from "@eshg/lib-portal/components/Row";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { RadioGroupField } from "@eshg/lib-portal/components/formFields/RadioGroupField";
import {
  AppointmentPickerField,
  FIELD_LABELS_DE,
} from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentPickerField";
import { Button, Grid, Radio, Sheet, Stack, Typography } from "@mui/joy";
import { addMinutes, startOfHour } from "date-fns";
import { useFormikContext } from "formik";
import { useEffect, useId, useState } from "react";

import { useGetFreeAppointments } from "@/lib/businessModules/stiProtection/api/queries/appointmentBlocks";
import { CreateAppointmentForm } from "@/lib/businessModules/stiProtection/features/procedures/details/CreateAppointmentSidebar";
import { concernToAppointmentType } from "@/lib/businessModules/stiProtection/shared/helpers";
import { DateTimeField } from "@/lib/shared/components/formFields/DateTimeField";
import {
  validateNonNegativeInteger,
  validateTodayOrFutureDate,
} from "@/lib/shared/helpers/validators";

import { AddNewProcedureForm } from "./AddNewProcedureSidebar";

function ConnectedAppointmentPicker({
  name,
  active,
}: {
  name: string;
  active?: boolean;
}) {
  const {
    values: { appointmentType, blockAppointment },
  } = useFormikContext<AddNewProcedureForm | CreateAppointmentForm>();
  const initialMonth = blockAppointment?.start ?? null;
  const [currentMonth, setCurrentMonth] = useState(initialMonth ?? new Date());
  const now = new Date();
  const freeAppointments = useGetFreeAppointments({
    appointmentType: appointmentType as ApiAppointmentType,
    earliestDate: startOfHour(now),
  });
  const monthAppointments = freeAppointments.data ?? [];

  return (
    <AppointmentPickerField
      name={name}
      active={active}
      currentMonth={currentMonth}
      setCurrentMonth={setCurrentMonth}
      monthAppointments={monthAppointments}
      required={true}
      labels={FIELD_LABELS_DE}
    />
  );
}

export function AppointmentForm({
  procedure,
}: Readonly<{ procedure?: ApiStiProtectionProcedure }>) {
  const appointmentBlockDescriptionId = useId();
  const { values, setFieldValue } = useFormikContext<
    AddNewProcedureForm | CreateAppointmentForm
  >();

  const blockSectionSelected =
    values.appointmentBookingType ===
    ApiAppointmentBookingType.AppointmentBlock;
  const customSectionSelected =
    values.appointmentBookingType === ApiAppointmentBookingType.UserDefined;

  useEffect(() => {
    if (!values.blockAppointment) {
      return;
    }
    void setFieldValue(
      "appointmentBookingType",
      ApiAppointmentBookingType.AppointmentBlock,
    );
  }, [values.blockAppointment, setFieldValue]);
  useEffect(() => {
    if (!values.customAppointmentDate && !values.customAppointmentDuration) {
      return;
    }
    void setFieldValue(
      "appointmentBookingType",
      ApiAppointmentBookingType.UserDefined,
    );
  }, [
    values.customAppointmentDate,
    values.customAppointmentDuration,
    setFieldValue,
  ]);

  useEffect(() => {
    let appointmentType: ApiAppointmentType | undefined;
    const [openAppointment] = procedure
      ? procedure.appointmentHistory.filter(
          ({ appointmentStatus }) => appointmentStatus === "OPEN",
        )
      : [];

    if (openAppointment?.appointmentType) {
      appointmentType = openAppointment?.appointmentType;
    } else if (values.concern) {
      appointmentType = concernToAppointmentType(values.concern);
    }

    if (appointmentType) void setFieldValue("appointmentType", appointmentType);
  }, [setFieldValue, values.concern, procedure]);

  return (
    <RadioGroupField
      name="appointmentBookingType"
      required="Bitte eine Buchungsart auswählen"
    >
      <Stack gap={2}>
        <Sheet
          aria-current={blockSectionSelected}
          onClick={() =>
            setFieldValue(
              "appointmentBookingType",
              ApiAppointmentBookingType.AppointmentBlock,
            )
          }
          aria-description="Termin aus Terminblock wählen"
        >
          <Grid container spacing={3} direction="row">
            <Grid>
              <Radio
                sx={{ flexBasis: "max-content" }}
                name="appointmentBookingType"
                value={ApiAppointmentBookingType.AppointmentBlock}
              />
            </Grid>
            <Grid xxs={10}>
              <Stack>
                <Typography
                  id={appointmentBlockDescriptionId}
                  style={{ marginBottom: "16px" }}
                >
                  Aus Terminblock
                </Typography>
                <Row justifyContent="center" flex={1}>
                  <ConnectedAppointmentPicker
                    name="blockAppointment"
                    active={blockSectionSelected}
                  />
                </Row>
              </Stack>
            </Grid>
          </Grid>
        </Sheet>
        <Sheet
          aria-current={customSectionSelected}
          onClick={() =>
            setFieldValue(
              "appointmentBookingType",
              ApiAppointmentBookingType.UserDefined,
            )
          }
          aria-description="Frei wählbarer Zeitraum für den Termin"
        >
          <Row>
            <Radio
              id="appointmentTypeCustom"
              name="appointmentBookingType"
              value={ApiAppointmentBookingType.UserDefined}
            />
            <Stack gap={1}>
              <DateTimeField
                label="Individueller Termin"
                name="customAppointmentDate"
                validate={validateTodayOrFutureDate}
                required={
                  customSectionSelected ? "Bitte ein Datum eingeben" : undefined
                }
              />
              <CustomAppointmentQuickButtons />
              <NumberField
                label="Termin Dauer in Min."
                name="customAppointmentDuration"
                min={0}
                validate={validateNonNegativeInteger}
                required={
                  customSectionSelected ? "Bitte ein Dauer eingeben" : undefined
                }
              />
            </Stack>
          </Row>
        </Sheet>
      </Stack>
    </RadioGroupField>
  );
}

function CustomAppointmentQuickButtons() {
  const { setFieldValue } = useFormikContext<AddNewProcedureForm>();
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
