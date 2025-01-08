/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature } from "@eshg/employee-portal-api/base";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  GENDER_OPTIONS,
  SALUTATION_OPTIONS,
  TITLE_OPTIONS,
} from "@eshg/lib-portal/components/formFields/constants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { Divider, Grid } from "@mui/joy";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { PersonContactFormValues } from "@/lib/baseModule/components/contacts/types";

const fieldName = createFieldNameMapper<PersonContactFormValues>();

export function PersonFormFields() {
  const showChatUsername = useIsNewFeatureEnabled(ApiBaseFeature.ChatUsername);
  return (
    <>
      <Grid xxs={6}>
        <SelectField
          name={fieldName("salutation")}
          label={"Anrede"}
          options={SALUTATION_OPTIONS}
        />
      </Grid>
      <Grid xxs={6}>
        <SelectField
          name={fieldName("title")}
          label={"Titel"}
          options={TITLE_OPTIONS}
        />
      </Grid>
      <Grid xxs={12}>
        <InputField
          name={fieldName("firstName")}
          label={"Vorname"}
          required={"Bitte einen Vornamen angeben"}
          validate={validateLength(1, 80)}
        />
      </Grid>
      <Grid xxs={12}>
        <InputField
          name={fieldName("name")}
          label={"Name"}
          required={"Bitte einen Namen angeben"}
          validate={validateLength(1, 120)}
        />
      </Grid>
      <Grid xxs={12}>
        <SelectField
          name={fieldName("gender")}
          label={"Geschlecht"}
          options={GENDER_OPTIONS}
        />
      </Grid>
      {showChatUsername && (
        <Grid xxs={12}>
          <InputField
            name={fieldName("externalChatUsername")}
            label={"Chat-ID"}
            validate={validateLength(1, 255)}
          />
        </Grid>
      )}
      <Grid xxs={12}>
        <Divider />
      </Grid>
    </>
  );
}
