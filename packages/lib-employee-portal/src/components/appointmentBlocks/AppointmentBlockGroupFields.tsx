/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Divider, Grid } from "@mui/joy";

import {
  MultiAutocompleteField,
  NumberField,
  SelectOption,
  validateInteger,
  validatePipe,
  validateRange,
} from "@eshg/lib-portal";

import { FormGroupGrid } from "../form/FormGroupGrid";

import { AppointmentBlockFieldArrayWithDays } from "./AppointmentBlockFieldArrayWithDays";
import { AppointmentBlockGroupValuesWithDays } from "./AppointmentBlockFormWithDays";

const validateParallelExaminations = validatePipe(
  validateInteger,
  validateRange(1, 10),
);

interface AppointmentBlockGroupFieldsProps {
  appointmentBlocksWithDays?: AppointmentBlockGroupValuesWithDays[];
  options: SelectOption[];
  showParallelExaminations?: boolean;
}

export function AppointmentBlockGroupFields(
  props: Readonly<AppointmentBlockGroupFieldsProps>,
) {
  return (
    <>
      <FormGroupGrid>
        <Grid xs={3}>
          <MultiAutocompleteField
            name="type"
            label="Art"
            placeholder="auswählen"
            options={props.options}
            required="Bitte eine Art auswählen."
          />
        </Grid>
        {props.showParallelExaminations ? (
          <Grid xs={3}>
            <NumberField
              name="parallelExaminations"
              label="Parallele Untersuchungen"
              required="Bitte die Anzahl paralleler Untersuchungen angeben."
              validate={validateParallelExaminations}
            />
          </Grid>
        ) : null}
      </FormGroupGrid>
      <Divider />
      <AppointmentBlockFieldArrayWithDays
        name="appointmentBlocks"
        appointmentBlocks={props.appointmentBlocksWithDays!}
      />
    </>
  );
}
