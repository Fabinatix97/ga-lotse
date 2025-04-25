/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Grid, IconButton } from "@mui/joy";
import { FieldArray } from "formik";

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";

// See InputArrayField
export function LegacyPhoneNumbersForm(props: {
  phoneNumbers: string[];
  isOptional: boolean;
}) {
  return (
    <FieldArray name="phoneNumbers">
      {({ push, remove }) => (
        <>
          {props.phoneNumbers.map((_, index) => (
            <Grid
              container
              key={index}
              direction="row"
              spacing={1}
              alignItems="flex-end"
            >
              <Grid xs={index > 0 ? 11 : 12}>
                <InputField
                  name={`phoneNumbers.${index}`}
                  label={`Telefonnummer ${index + 1}`}
                  required={
                    index === 0 && !props.isOptional
                      ? "Bitte eine Telefonnummer angeben."
                      : undefined
                  }
                />
              </Grid>
              {index > 0 && (
                <Grid xs={1}>
                  <IconButton color="primary" onClick={() => remove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          ))}
          <Grid xs={12}>
            <Button
              variant="plain"
              color="primary"
              startDecorator={<AddIcon />}
              onClick={() => push("")}
            >
              {props.phoneNumbers.length === 0
                ? "Telefonnummer hinzufügen"
                : "Weitere Telefonnummer hinzufügen"}
            </Button>
          </Grid>
        </>
      )}
    </FieldArray>
  );
}
