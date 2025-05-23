/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import {
  BooleanRadioField,
  NestedFormProps,
  createFieldNameMapper,
} from "@eshg/lib-portal";
import { WrittenConfirmationFormValues } from "@eshg/lib-portal/businessModules/medicalRegistry/medicalRegistryCreateProcedureFormValues";

export function WrittenConfirmationForm(props: NestedFormProps) {
  const fieldName = createFieldNameMapper<WrittenConfirmationFormValues>(
    props.name,
  );

  return (
    <>
      <Typography level="h3" component="h2">
        Bescheinigung
      </Typography>
      <BooleanRadioField
        name={fieldName("requestForWrittenConfirmation")}
        label="Es soll eine schriftliche Meldebestätigung per Post versendet werden."
      />
    </>
  );
}
