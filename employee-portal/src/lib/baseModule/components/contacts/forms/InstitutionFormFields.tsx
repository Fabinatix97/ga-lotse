/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiContactCategory } from "@eshg/employee-portal-api/base";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { Divider, Grid } from "@mui/joy";

import { contactCategoryNames } from "@/lib/baseModule/shared/translations";

export function InstitutionFormFields() {
  return (
    <>
      <Grid xxs={12}>
        <InputField
          name={"name"}
          label={"Name"}
          required={"Bitte einen Namen angeben"}
          validate={validateLength(1, 120)}
        />
      </Grid>
      <Grid xxs={12}>
        <SelectField
          options={buildEnumOptions<ApiContactCategory>(contactCategoryNames)}
          name={"category"}
          label={"Objekttyp"}
          required={"Bitte eine Objekttyp angeben"}
        />
      </Grid>
      <Grid xxs={12}>
        <Divider />
      </Grid>
    </>
  );
}
