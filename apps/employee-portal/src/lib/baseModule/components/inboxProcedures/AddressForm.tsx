/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Grid, Stack, Typography } from "@mui/joy";

import {
  AddressAutoFillField,
  EmailField,
  InputField,
  NestedFormProps,
  StreetField,
  createFieldNameMapper,
} from "@eshg/lib-portal";

import { useStreetApi } from "@/lib/baseModule/api/clients";

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
  const streetApi = useStreetApi();

  return (
    <>
      <Stack direction="row" gap={2}>
        <Grid xs={8} padding={0}>
          <StreetField
            name={fieldName("street")}
            label="Straße"
            api={streetApi}
          />
        </Grid>
        <Grid xs={4} padding={0}>
          <InputField name={fieldName("houseNumber")} label="Hausnummer" />
        </Grid>
      </Stack>
      <InputField name={fieldName("addressAddition")} label="Adresszusatz" />
      <Stack direction="row" gap={2}>
        <Grid xs={4} padding={0}>
          <AddressAutoFillField
            name="postalCode"
            fieldName={fieldName}
            label="Postleitzahl"
            api={streetApi}
          />
        </Grid>
        <Grid xs={8} padding={0}>
          <AddressAutoFillField
            name="city"
            fieldName={fieldName}
            label="Stadt"
            api={streetApi}
          />
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
