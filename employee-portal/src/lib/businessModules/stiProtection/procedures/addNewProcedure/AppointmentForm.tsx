/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { Grid, Radio, Sheet, Stack, Typography } from "@mui/joy";
import {
  addDays,
  addHours,
  addMinutes,
  endOfMonth,
  isWithinInterval,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { useFormikContext } from "formik";
import { useEffect, useId, useState } from "react";
import { uniqueBy } from "remeda";

import { Row } from "@/lib/shared/Row";
import { DateTimeField } from "@/lib/shared/components/formFields/DateTimeField";
import { RadioGroupField } from "@/lib/shared/components/formFields/RadioGroupField";

import { AddNewProcedureForm } from "./AddNewProcedureSidebar";
import { AppointmentPickerField } from "./AppointmentPickerField";

const availableAppointments = uniqueBy(
  new Array(1000)
    .fill(startOfDay(new Date()))
    .map((d: Date, index) =>
      addMinutes(
        addHours(addDays(d, (index % 101) - 50), (index % 8) + 5),
        (index % 3) * 15,
      ),
    )
    .filter((t) => t.getDay() !== 0 && t.getDay() !== 6),
  (d) => d.getTime(),
);

function ConnectedAppointmentPicker({
  name,
  active,
  initialMonth,
}: {
  name: string;
  active?: boolean;
  initialMonth: Date | null;
}) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth ?? new Date());
  const currentInterval = {
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  };
  const monthAppointments = availableAppointments.filter((t) =>
    isWithinInterval(t, currentInterval),
  );

  return (
    <AppointmentPickerField
      name={name}
      required={"Bitte ein Termin auswählen"}
      active={active}
      currentMonth={currentMonth}
      setCurrentMonth={setCurrentMonth}
      monthAppointments={monthAppointments}
    />
  );
}

export function AppointmentForm() {
  const appointmentBlockDescriptionlId = useId();
  const { values, setFieldValue } = useFormikContext<AddNewProcedureForm>();

  const blockSectionSelected = values.appointmentType === "APPOINTMENT_BLOCK";
  const customSectionSelected = values.appointmentType === "CUSTOM";

  useEffect(() => {
    if (!values.blockAppointment) {
      return;
    }
    void setFieldValue("appointmentType", "APPOINTMENT_BLOCK");
  }, [values.blockAppointment, setFieldValue]);
  useEffect(() => {
    if (!values.customAppointmentDate && !values.customAppointmentDuration) {
      return;
    }
    void setFieldValue("appointmentType", "CUSTOM");
  }, [
    values.customAppointmentDate,
    values.customAppointmentDuration,
    setFieldValue,
  ]);

  return (
    <RadioGroupField
      name="appointmentType"
      required="Bitte ein Termin anliegen"
    >
      <Stack gap={2}>
        <Sheet
          aria-current={blockSectionSelected}
          onClick={() => setFieldValue("appointmentType", "APPOINTMENT_BLOCK")}
          aria-description="Termin aus Terminblock wählen"
        >
          <Grid container spacing={3} direction="row">
            <Grid>
              <Radio
                sx={{ flexBasis: "max-content" }}
                name="appointmentType"
                value="APPOINTMENT_BLOCK"
              />
            </Grid>
            <Grid xxs={10}>
              <Stack>
                <Typography
                  id={appointmentBlockDescriptionlId}
                  style={{ marginBottom: "16px" }}
                >
                  Aus Terminblock
                </Typography>
                <Row justifyContent="center" flex={1}>
                  <ConnectedAppointmentPicker
                    name="blockAppointment"
                    active={blockSectionSelected}
                    initialMonth={values.blockAppointment ?? null}
                  />
                </Row>
              </Stack>
            </Grid>
          </Grid>
        </Sheet>
        <Sheet
          aria-current={customSectionSelected}
          onClick={() => setFieldValue("appointmentType", "CUSTOM")}
          aria-description="Frei wählbarer Zeitraum für den Termin"
        >
          <Row>
            <Radio
              id="appointmentTypeCustom"
              name="appointmentType"
              value="CUSTOM"
            />
            <Stack gap={1}>
              <DateTimeField
                allowEmpty={!customSectionSelected}
                label="Individueller Termin"
                name="customAppointmentDate"
                required={
                  customSectionSelected ? "Bitte ein Datum eingeben" : undefined
                }
              />
              <NumberField
                label="Termin Dauer in Min."
                name="customAppointmentDuration"
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
