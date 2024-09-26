/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Add, Delete } from "@mui/icons-material";
import { Grid } from "@mui/joy";
import { FieldArray } from "formik";

import {
  AppointmentBlockFormWithDays,
  AppointmentBlockGroupValuesWithDays,
  emptyAppointmentBlockGroup,
} from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
import { FieldIconButton } from "@/lib/shared/components/buttons/FieldIconButton";
import { FieldButtonBar } from "@/lib/shared/components/form/FieldButtonBar";
import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";

const APPOINTMENT_BLOCK_GROUP_MAX_LENGTH = 5;

interface AppointmentBlockFieldArrayWithDaysProps {
  name: string;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
}

export function AppointmentBlockFieldArrayWithDays(
  props: Readonly<AppointmentBlockFieldArrayWithDaysProps>,
) {
  return (
    <FieldArray name={props.name}>
      {({ insert, remove }) =>
        props.appointmentBlocks.map((_value, index) => (
          <FormGroupGrid key={index} data-testid="appointmentBlockForm">
            <AppointmentBlockFormWithDays name={`appointmentBlocks.${index}`} />
            <Grid xs={2}>
              <FieldButtonBar>
                <FieldIconButton
                  title="Weiteren Terminblock hinzufügen"
                  disabled={
                    props.appointmentBlocks.length >=
                    APPOINTMENT_BLOCK_GROUP_MAX_LENGTH
                  }
                  onClick={() => {
                    if (
                      props.appointmentBlocks.length <
                      APPOINTMENT_BLOCK_GROUP_MAX_LENGTH
                    )
                      insert(index + 1, emptyAppointmentBlockGroup());
                  }}
                >
                  <Add />
                </FieldIconButton>
                {props.appointmentBlocks.length > 1 && (
                  <FieldIconButton
                    title="Terminblock entfernen"
                    onClick={() => remove(index)}
                    color="danger"
                  >
                    <Delete color="danger" />
                  </FieldIconButton>
                )}
              </FieldButtonBar>
            </Grid>
          </FormGroupGrid>
        ))
      }
    </FieldArray>
  );
}
