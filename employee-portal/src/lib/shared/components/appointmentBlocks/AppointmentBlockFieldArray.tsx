/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Add, DeleteOutlined } from "@mui/icons-material";
import { Grid } from "@mui/joy";
import { FieldArray } from "formik";

import {
  AppointmentBlockForm,
  AppointmentBlockValues,
  emptyAppointmentBlock,
} from "@/lib/shared/components/appointmentBlocks/AppointmentBlockForm";
import { FieldIconButton } from "@/lib/shared/components/buttons/FieldIconButton";
import { FieldButtonBar } from "@/lib/shared/components/form/FieldButtonBar";
import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";

interface AppointmentBlockFieldArrayProps {
  name: string;
  appointmentBlocks: AppointmentBlockValues[];
}

export function AppointmentBlockFieldArray(
  props: Readonly<AppointmentBlockFieldArrayProps>,
) {
  return (
    <FieldArray name={props.name}>
      {({ insert, remove }) =>
        props.appointmentBlocks.map((value, index) => (
          <FormGroupGrid key={index} data-testid="appointmentBlockForm">
            <AppointmentBlockForm name={`appointmentBlocks.${index}`} />
            <Grid xs={1}>
              <FieldButtonBar>
                <FieldIconButton
                  title="Weiteren Terminblock hinzufügen"
                  onClick={() => insert(index + 1, emptyAppointmentBlock())}
                >
                  <Add />
                </FieldIconButton>
                {props.appointmentBlocks.length > 1 && (
                  <FieldIconButton
                    title="Terminblock entfernen"
                    onClick={() => remove(index)}
                  >
                    <DeleteOutlined />
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
