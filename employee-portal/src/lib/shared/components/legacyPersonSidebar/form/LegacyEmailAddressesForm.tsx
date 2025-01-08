/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { EmailField } from "@eshg/lib-portal/components/formFields/EmailField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Grid, IconButton } from "@mui/joy";
import { FieldArray } from "formik";

// See InputArrayField with fieldComponent={EmailField}
export function LegacyEmailAddressesForm(props: {
  emailAddresses: string[];
  isOptional: boolean;
}) {
  return (
    <FieldArray name="emailAddresses">
      {({ push, remove }) => (
        <>
          {props.emailAddresses.map((_, index) => (
            <Grid
              container
              key={index}
              direction="row"
              spacing={1}
              alignItems="flex-end"
            >
              <Grid xs={index > 0 ? 11 : 12}>
                <EmailField
                  name={`emailAddresses.${index}`}
                  label={`E-Mail-Adresse ${index + 1}`}
                  required={
                    index === 0 && !props.isOptional
                      ? "Bitte eine E-Mail-Adresse angeben."
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
              {props.emailAddresses.length === 0
                ? "E-Mail-Adresse hinzufügen"
                : "Weitere E-Mail-Adresse hinzufügen"}
            </Button>
          </Grid>
        </>
      )}
    </FieldArray>
  );
}
