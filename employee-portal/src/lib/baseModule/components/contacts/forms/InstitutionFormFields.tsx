/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiContactCategory } from "@eshg/base-api";
import { CONTACT_CATEGORY_NAMES } from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { Divider, Grid } from "@mui/joy";

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
          options={buildEnumOptions<ApiContactCategory>(CONTACT_CATEGORY_NAMES)}
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
