/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTypeOfChange } from "@eshg/employee-portal-api/medicalRegistry";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  buildEnumOptions,
  createFieldNameMapper,
} from "@eshg/lib-portal/helpers/form";
import {
  NestedFormProps,
  OptionalFieldValue,
} from "@eshg/lib-portal/types/form";
import { Grid, Typography } from "@mui/joy";

import { changeTypeNames } from "@/lib/businessModules/medicalRegistry/shared/constants";

import { requiredFieldMessage } from "./MedicalRegistryCreateProcedureForm";

export interface GeneralInformationFormValues {
  changeType: OptionalFieldValue<ApiTypeOfChange>;
}

export function GeneralInformationForm(props: NestedFormProps) {
  const fieldName = createFieldNameMapper<GeneralInformationFormValues>(
    props.name,
  );

  return (
    <>
      <Grid xxs={12}>
        <Typography level="h3">Allgemeine Angaben</Typography>
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
