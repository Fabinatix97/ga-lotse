/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Add } from "@mui/icons-material";
import { Button, Divider, Grid } from "@mui/joy";
import { Fragment } from "react";

import {
  FieldArrayWithFocus as FieldArray,
  createFieldNameMapper,
} from "@eshg/lib-portal";

import {
  AppointmentBlockFormWithDays,
  AppointmentBlockGroupValues,
  emptyAppointmentBlockGroup,
} from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";

const APPOINTMENT_BLOCK_GROUP_MAX_LENGTH = 5;

interface AppointmentBlockFieldArrayWithDaysProps {
  name: string;
  appointmentBlocks: AppointmentBlockGroupValues["appointmentBlocks"];
}

export function AppointmentBlockFieldArrayWithDays(
  props: Readonly<AppointmentBlockFieldArrayWithDaysProps>,
) {
  const fieldName = createFieldNameMapper<AppointmentBlockGroupValues>();
  const hasReachedAppointmentBlockLimit =
    props.appointmentBlocks.length >= APPOINTMENT_BLOCK_GROUP_MAX_LENGTH;

  return (
    <FieldArray valueLength={props.appointmentBlocks.length} name={props.name}>
      {({ remove, push, setInputElementRef }) => (
        <>
          {props.appointmentBlocks.map((_value, index) => (
            <Fragment key={index}>
              <FormGroupGrid data-testid="appointmentBlockForm">
                <AppointmentBlockFormWithDays
                  ref={(el) => setInputElementRef(el, index)}
                  name={`${fieldName("appointmentBlocks")}.${index}`}
                  removeBlock={() => remove(index)}
                  index={index}
                  blockCount={props.appointmentBlocks.length}
                />
              </FormGroupGrid>
              {props.appointmentBlocks.length > 1 &&
                index < props.appointmentBlocks.length - 1 && <Divider />}
            </Fragment>
          ))}
          <>
            <Divider />
            {!hasReachedAppointmentBlockLimit && (
              <Grid xs={2}>
                <Button
                  variant="outlined"
                  startDecorator={<Add />}
                  onClick={() => {
                    if (!hasReachedAppointmentBlockLimit) {
                      push(emptyAppointmentBlockGroup());
                    }
                  }}
                >
                  Terminblock hinzufügen
                </Button>
              </Grid>
            )}
          </>
        </>
      )}
    </FieldArray>
  );
}
