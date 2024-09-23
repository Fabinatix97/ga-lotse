/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import {
  validateInteger,
  validatePipe,
  validateRange,
} from "@eshg/lib-portal/helpers/validators";
import { Grid } from "@mui/joy";

import { AppointmentBlockFieldArray } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFieldArray";
import { AppointmentBlockFieldArrayWithDays } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFieldArrayWithDays";
import { AppointmentBlockValues } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockForm";
import { AppointmentBlockGroupValuesWithDays } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";

const validateParallelExaminations = validatePipe(
  validateInteger,
  validateRange(1, 10),
);

export interface AppointmentBlockGroupFieldsProps {
  appointmentBlocks?: AppointmentBlockValues[];
  appointmentBlocksWithDays?: AppointmentBlockGroupValuesWithDays[];
  options: SelectOption[];
  showParallelExaminations: boolean;
  showAppointmentBlockFieldArrayWithDays: boolean;
}

export function AppointmentBlockGroupFields(
  props: Readonly<AppointmentBlockGroupFieldsProps>,
) {
  return (
    <>
      <FormGroupGrid>
        <Grid xs={4}>
          <SelectField
            name="type"
            label="Art"
            placeholder="auswählen"
            options={props.options}
            required="Bitte eine Art auswählen."
          />
        </Grid>
        {props.showParallelExaminations ? (
          <Grid xs={2}>
            <NumberField
              name="parallelExaminations"
              label="Parallele Untersuchungen"
              required="Bitte die Anzahl paralleler Untersuchungen angeben."
              validate={validateParallelExaminations}
            />
          </Grid>
        ) : null}
      </FormGroupGrid>
      {props.showAppointmentBlockFieldArrayWithDays ? (
        <AppointmentBlockFieldArrayWithDays
          name="appointmentBlocks"
          appointmentBlocks={props.appointmentBlocksWithDays!}
        />
      ) : (
        <AppointmentBlockFieldArray
          name="appointmentBlocks"
          appointmentBlocks={props.appointmentBlocks!}
        />
      )}
    </>
  );
}
