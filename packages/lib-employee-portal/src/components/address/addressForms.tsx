/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ApiCountryCode } from "@eshg/base-api";
import { FormAddMoreButton } from "@eshg/lib-portal/components/form/FormAddMoreButton";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { validatePipe } from "@eshg/lib-portal/helpers/validators";
import { useValidators } from "@eshg/lib-portal/hooks/useValidators";
import { NestedFormProps } from "@eshg/lib-portal/types/form";
import { Add, DeleteOutlined } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { useId } from "react";
import { isNonNullish } from "remeda";

import { BaseAddressType } from "@/api/models/address";
import { CountryField } from "@/components/formFields/CountryField";
import { validateZipCode } from "@/utils/validators";

import { StreetField } from "./StreetField";
import { StreetListeningField } from "./StreetListeningField";
import { createEmptyAddress } from "./helpers";

export interface BaseAddressFormInputs {
  type: BaseAddressType;
  postbox: string;
  street: string;
  houseNumber: string;
  addressAddition: string;
  differentName: string;
  postalCode: string;
  city: string;
  country: ApiCountryCode;
}

interface AddressFormProps extends Partial<NestedFormProps> {
  type: BaseAddressType;
}

export function ContactAddressForm(props: AddressFormProps) {
  const fieldName = createFieldNameMapper<BaseAddressFormInputs>(props.name);

  return (
    <>
      <CommonAddressFields type={props.type} fieldName={fieldName} />
    </>
  );
}

export function OptionalContactAddressForm(props: {
  name: string;
  values?: BaseAddressFormInputs;
  optional?: boolean;
}) {
  const { setFieldValue } = useFormikContext();
  const id = useId();

  return (
    <>
      {isNonNullish(props.values) ? (
        <Box
          component={"section"}
          aria-labelledby={id}
          sx={{ display: "contents" }}
        >
          <Grid xxs={12}>
            <Typography
              level="title-md"
              id={id}
              justifyContent="space-between"
              endDecorator={
                props.optional && (
                  <IconButton
                    aria-label="Entfernen"
                    onClick={() => setFieldValue(props.name, undefined, false)}
                  >
                    <DeleteOutlined color={"primary"} />
                  </IconButton>
                )
              }
            >
              Kontaktadresse
            </Typography>
          </Grid>
          <ContactAddressForm name={props.name} type={props.values.type} />
        </Box>
      ) : (
        <Grid xxs={12}>
          <FormAddMoreButton
            onClick={() => setFieldValue(props.name, createEmptyAddress())}
          >
            Kontaktadresse hinzufügen
          </FormAddMoreButton>
        </Grid>
      )}
    </>
  );
}

export function BillingAddressForm(
  props: AddressFormProps & { optional?: boolean },
) {
  const { validateLength } = useValidators();
  const name = props.name;
  const fieldName = createFieldNameMapper<BaseAddressFormInputs>(name);
  const { setFieldValue } = useFormikContext();

  const canRemove = props.optional && isNonNullish(name);

  return (
    <Box
      component={"section"}
      aria-labelledby={"different-billing-address-form-section-title"}
      sx={{
        display: "contents",
      }}
    >
      {canRemove && (
        <Grid xxs={12}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography
              level={"title-md"}
              id={"different-billing-address-form-section-title"}
            >
              Abweichende Rechnungsadresse
            </Typography>
            <IconButton
              aria-label="Entfernen"
              color="primary"
              onClick={() => setFieldValue(name, undefined, false)}
            >
              <DeleteOutlined color={"primary"} />
            </IconButton>
          </Stack>
        </Grid>
      )}
      <Grid xxs={12}>
        <InputField
          name={fieldName("differentName")}
          label={"Abweichender Empfänger"}
          placeholder={"Wenn der Name von der Kontaktadresse abweicht"}
          validate={validateLength(1, 200)}
        />
      </Grid>
      <CommonAddressFields type={props.type} fieldName={fieldName} />
    </Box>
  );
}

export function OptionalBillingAddressForm(props: {
  name: string;
  values?: BaseAddressFormInputs;
}) {
  const { setFieldValue } = useFormikContext();
  return (
    <>
      {isNonNullish(props.values) ? (
        <BillingAddressForm
          optional
          name={props.name}
          type={props.values.type}
        />
      ) : (
        <>
          <Grid xxs={12}>
            <Button
              onClick={() => setFieldValue(props.name, createEmptyAddress())}
              variant={"plain"}
              size={"sm"}
              sx={{ padding: 0, margin: 0, "--Button-minHeight": 0 }}
              startDecorator={<Add />}
            >
              Abweichende Rechnungsadresse eingeben
            </Button>
          </Grid>
        </>
      )}
    </>
  );
}

const typeOptions: SelectOption[] = [
  {
    value: "DomesticAddress",
    label: "Hausanschrift",
  },
  {
    value: "PostboxAddress",
    label: "Postfach",
  },
] satisfies { label: string; value: BaseAddressType }[];

function CommonAddressFields({
  type,
  fieldName,
}: {
  type: BaseAddressType;
  fieldName: (key: keyof BaseAddressFormInputs) => string;
}) {
  const { validateLength } = useValidators();
  const ctx = useFormikContext<BaseAddressFormInputs>();

  function getValue<K extends keyof BaseAddressFormInputs>(key: K) {
    return ctx.getFieldMeta<BaseAddressFormInputs[K]>(fieldName(key)).value;
  }

  const street = getValue("street");

  return (
    <>
      <Grid xxs={12}>
        <SelectField
          options={typeOptions}
          name={fieldName("type")}
          label={"Art"}
          required={"Bitte die Art der Adresse angeben"}
        />
      </Grid>
      {type === "DomesticAddress" && (
        <>
          <Grid xxs={12} xs={9}>
            <StreetField
              name={fieldName("street")}
              label="Straße"
              required="Bitte eine Straße angeben"
              validate={validateLength(1, 55)}
            />
          </Grid>
          <Grid xxs={12} xs={3}>
            <InputField
              name={fieldName("houseNumber")}
              label="Haus-Nr."
              validate={validateLength(1, 11)}
            />
          </Grid>
          <Grid xxs={12}>
            <InputField
              name={fieldName("addressAddition")}
              label="Adresszusatz"
              validate={(value) =>
                value ? validateLength(1, 100)(value) : undefined
              }
            />
          </Grid>
        </>
      )}
      {type === "PostboxAddress" && (
        <Grid xxs={12}>
          <InputField
            name={fieldName("postbox")}
            label={"Postfachnummer"}
            required={"Bitte eine Postfachnummer angeben"}
            validate={validateLength(1, 21)}
          />
        </Grid>
      )}
      <Grid xxs={12} xs={4}>
        <StreetListeningField
          name={fieldName("postalCode")}
          label="Postleitzahl"
          required="Bitte PLZ angeben"
          validate={validatePipe(
            validateZipCode(getValue("country")),
            validateLength(1, 20),
          )}
          property="postCode"
          street={street}
        />
      </Grid>
      <Grid xxs={12} xs={8}>
        <StreetListeningField
          name={fieldName("city")}
          label="Ort"
          required="Bitte einen Ort angeben"
          validate={validateLength(1, 50)}
          property="city"
          street={street}
        />
      </Grid>
      <Grid xxs={12}>
        <CountryField
          name={fieldName("country")}
          label="Land"
          required="Bitte Land auswählen"
        />
      </Grid>
    </>
  );
}
