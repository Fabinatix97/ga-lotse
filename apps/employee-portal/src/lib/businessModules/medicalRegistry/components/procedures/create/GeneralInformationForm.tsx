/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Typography } from "@mui/joy";

import {
  NestedFormProps,
  SelectField,
  buildEnumOptions,
  createFieldNameMapper,
} from "@eshg/lib-portal";
import {
  CHANGE_TYPE_NAMES,
  GeneralInformationFormValues,
} from "@eshg/medical-registry";

import { requiredFieldMessage } from "./MedicalRegistryCreateProcedureForm";

export function GeneralInformationForm(props: NestedFormProps) {
  const fieldName = createFieldNameMapper<GeneralInformationFormValues>(
    props.name,
  );

  return (
    <>
      <Grid xxs={12}>
        <Typography level="h3" component="h2">
          Allgemeine Angaben
        </Typography>
      </Grid>
      <Grid xxs={6}>
        <SelectField
          name={fieldName("changeType")}
          label="Änderungsart"
          options={buildEnumOptions(CHANGE_TYPE_NAMES)}
          required={requiredFieldMessage}
        />
      </Grid>
    </>
  );
}
