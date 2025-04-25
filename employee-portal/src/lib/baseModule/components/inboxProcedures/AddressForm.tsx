/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Grid, Stack, Typography } from "@mui/joy";

import { EmailField } from "@eshg/lib-portal/components/formFields/EmailField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { NestedFormProps } from "@eshg/lib-portal/types/form";

import { validatePostboxNumber } from "./validate";

export const EMPTY_ADDRESS_VALUES: AddressValues = {
  street: "",
  houseNumber: "",
  addressAddition: "",
  postalCode: "",
  city: "",
  country: "",
  emailAddress: "",
  phoneNumber: "",
  postbox: "",
};

export interface AddressValues {
  street: string;
  houseNumber: string;
  addressAddition: string;
  postalCode: string;
  city: string;
  country: string;
  emailAddress: string;
  phoneNumber: string;
  postbox: string;
}

export function AddressForm(props: NestedFormProps) {
  const fieldName = createFieldNameMapper(props.name);

  return (
    <>
      <Stack direction="row" gap={2}>
        <Grid xs={8} padding={0}>
          <InputField name={fieldName("street")} label="Straße" />
        </Grid>
        <Grid xs={4} padding={0}>
          <InputField name={fieldName("houseNumber")} label="Hausnummer" />
        </Grid>
      </Stack>
      <InputField name={fieldName("addressAddition")} label="Adresszusatz" />
      <Stack direction="row" gap={2}>
        <Grid xs={4} padding={0}>
          <InputField name={fieldName("postalCode")} label="Postleitzahl" />
        </Grid>
        <Grid xs={8} padding={0}>
          <InputField name={fieldName("city")} label="Stadt" />
        </Grid>
      </Stack>
      <InputField name={fieldName("country")} label="Land" />
      <Divider />
      <EmailField name={fieldName("emailAddress")} label="E-Mail-Adresse" />
      <InputField
        name={fieldName("phoneNumber")}
        label="Telefonnummer"
        type="tel"
      />
      <Typography level="title-md">Postfach</Typography>
      <InputField
        name={fieldName("postbox")}
        label="Postfachnummer"
        validate={validatePostboxNumber}
      />
    </>
  );
}
