/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { changeTypeNames } from "@eshg/lib-portal/businessModules/medicalRegistry/constants";
import { GeneralInformationFormValues } from "@eshg/lib-portal/businessModules/medicalRegistry/medicalRegistryCreateProcedureFormValues";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  buildEnumOptions,
  createFieldNameMapper,
} from "@eshg/lib-portal/helpers/form";
import { NestedFormProps } from "@eshg/lib-portal/types/form";
import { Grid, Typography } from "@mui/joy";

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
          options={buildEnumOptions(changeTypeNames)}
          required={requiredFieldMessage}
        />
      </Grid>
    </>
  );
}
