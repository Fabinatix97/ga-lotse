/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Divider, Grid } from "@mui/joy";
import { useFormikContext } from "formik";
import { isDefined, isObjectType } from "remeda";

import {
  BooleanSelectField,
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
  const { values } = useFormikContext();
  const showExtraLength =
    isObjectType(values) &&
    "extraLength" in values &&
    isDefined(values.extraLength);

  return (
    <>
      <FormGroupGrid>
        <Grid xs={3}>
          <MultiAutocompleteField
            name="types"
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
        {showExtraLength ? (
          <Grid xs={3}>
            <BooleanSelectField
              name="extraLength"
              required="Eine Auswahl muss getroffen werden"
              label="Extralänge"
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
