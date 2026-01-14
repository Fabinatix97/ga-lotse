/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Grid } from "@mui/joy";

import { ApiContactCategory } from "@eshg/base-api";
import {
  CONTACT_CATEGORY_NAMES,
  getSubCategories,
  hasSubCategories,
} from "@eshg/lib-employee-portal";
import {
  InputField,
  SelectField,
  buildEnumOptions,
  useValidateLength,
} from "@eshg/lib-portal";

interface InstitutionEntityFormProps {
  category?: ApiContactCategory;
}

export function InstitutionFormFields({
  category,
}: InstitutionEntityFormProps) {
  const validateLength = useValidateLength();

  return (
    <>
      <Grid xxs={12}>
        <InputField
          name="name"
          label="Name"
          required="Bitte einen Namen angeben"
          validate={validateLength(1, 120)}
        />
      </Grid>
      <Grid xxs={12}>
        <SelectField
          options={buildEnumOptions(CONTACT_CATEGORY_NAMES)}
          name="category"
          label="Objekttyp"
          required="Bitte eine Objekttyp angeben"
        />
      </Grid>
      {hasSubCategories(category) && (
        <Grid xxs={12}>
          <SelectField
            options={buildEnumOptions(getSubCategories(category)!, true)}
            name="subCategory"
            label="Objektart"
          />
        </Grid>
      )}
      <Grid xxs={12}>
        <Divider />
      </Grid>
    </>
  );
}
