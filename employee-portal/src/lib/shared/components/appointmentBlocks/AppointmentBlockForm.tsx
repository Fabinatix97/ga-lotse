/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { NestedFormProps } from "@eshg/lib-portal/types/form";
import { Grid } from "@mui/joy";

import { TimeField } from "@/lib/shared/components/formFields/TimeField";
import { validateTodayOrFutureDate } from "@/lib/shared/helpers/validators";

export function emptyAppointmentBlock(): AppointmentBlockValues {
  return { date: "", startTime: "", endTime: "" };
}

export interface AppointmentBlockValues {
  date: string;
  startTime: string;
  endTime: string;
}

export function AppointmentBlockForm(props: Readonly<NestedFormProps>) {
  const fieldName = createFieldNameMapper(props.name);

  return (
    <>
      <Grid xs={2}>
        <DateField
          name={fieldName("date")}
          label="Datum"
          required="Bitte ein Datum angeben."
          validate={validateTodayOrFutureDate}
        />
      </Grid>
      <Grid xs={2}>
        <TimeField
          name={fieldName("startTime")}
          label="Startzeit"
          required="Bitte eine Startzeit angeben."
        />
      </Grid>
      <Grid xs={2}>
        <TimeField
          name={fieldName("endTime")}
          label="Endzeit"
          required="Bitte eine Endzeit angeben."
        />
      </Grid>
    </>
  );
}
