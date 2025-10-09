/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Add, DeleteOutlined } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { useId } from "react";
import { isNonNullish } from "remeda";

import { ApiCountryCode } from "@eshg/base-api";
import {
  AddressAutoFillField,
  FormAddMoreButton,
  InputField,
  NestedFormProps,
  SelectField,
  SelectOption,
  StreetField,
  createFieldNameMapper,
  useValidateLength,
  validatePipe,
  validateZipCode,
} from "@eshg/lib-portal";

import { BaseAddressType } from "../../api/models/address";
import { useApi } from "../../contexts/api";
import { CountryField } from "../formFields/CountryField";

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
  canChooseType?: boolean;
  ref?: (el: HTMLElement) => void;
}

export function ContactAddressForm(props: AddressFormProps) {
  const fieldName = createFieldNameMapper<BaseAddressFormInputs>(props.name);

  return <CommonAddressFields {...props} fieldName={fieldName} />;
}

export function OptionalContactAddressForm(props: {
  name: string;
  values?: BaseAddressFormInputs;
  optional?: boolean;
}) {
  const { setFieldValue } = useFormikContext();
  const id = useId();

  if (props.values === undefined) {
    return (
      <Grid xxs={12}>
        <FormAddMoreButton
          onClick={() => setFieldValue(props.name, createEmptyAddress())}
        >
          Kontaktadresse hinzufügen
        </FormAddMoreButton>
      </Grid>
    );
  }

  return (
    <Box component="section" aria-labelledby={id} sx={{ display: "contents" }}>
      <Grid xxs={12}>
        <Typography
          level="title-md"
          id={id}
          justifyContent="space-between"
          endDecorator={
            props.optional ? (
              <IconButton
                aria-label="Entfernen"
                onClick={() => setFieldValue(props.name, undefined, false)}
              >
                <DeleteOutlined color="primary" />
              </IconButton>
            ) : null
          }
        >
          Kontaktadresse
        </Typography>
      </Grid>
      <ContactAddressForm name={props.name} type={props.values.type} />
    </Box>
  );
}

export function BillingAddressForm(
  props: AddressFormProps & { optional?: boolean },
) {
  const validateLength = useValidateLength();
  const name = props.name;
  const fieldName = createFieldNameMapper<BaseAddressFormInputs>(name);
  const { setFieldValue } = useFormikContext();

  const canRemove = props.optional && isNonNullish(name);

  return (
    <Box
      component="section"
      aria-labelledby="different-billing-address-form-section-title"
      sx={{
        display: "contents",
      }}
    >
      {canRemove && (
        <Grid xxs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              level="title-md"
              id="different-billing-address-form-section-title"
            >
              Abweichende Rechnungsadresse
            </Typography>
            <IconButton
              aria-label="Entfernen"
              color="primary"
              onClick={() => setFieldValue(name, undefined, false)}
            >
              <DeleteOutlined color="primary" />
            </IconButton>
          </Stack>
        </Grid>
      )}
      <Grid xxs={12}>
        <InputField
          name={fieldName("differentName")}
          label="Abweichender Empfänger"
          placeholder="Wenn der Name von der Kontaktadresse abweicht"
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

  if (props.values === undefined) {
    return (
      <Grid xxs={12}>
        <Button
          variant="plain"
          size="sm"
          sx={{ padding: 0, margin: 0, "--Button-minHeight": 0 }}
          startDecorator={<Add />}
          onClick={() => setFieldValue(props.name, createEmptyAddress())}
        >
          Abweichende Rechnungsadresse eingeben
        </Button>
      </Grid>
    );
  }

  return (
    <BillingAddressForm optional name={props.name} type={props.values.type} />
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
  canChooseType = true,
  fieldName,
  ref,
}: {
  type: BaseAddressType;
  canChooseType?: boolean;
  fieldName: (key: keyof BaseAddressFormInputs) => string;
  ref?: (el: HTMLElement) => void;
}) {
  const { streetApi } = useApi();
  const validateLength = useValidateLength();
  const ctx = useFormikContext<BaseAddressFormInputs>();

  function getValue<K extends keyof BaseAddressFormInputs>(key: K) {
    return ctx.getFieldMeta<BaseAddressFormInputs[K]>(fieldName(key)).value;
  }

  return (
    <>
      {canChooseType && (
        <Grid xxs={12}>
          <SelectField
            ref={(el) => el && ref?.(el)}
            options={typeOptions}
            name={fieldName("type")}
            label="Art"
            required="Bitte die Art der Adresse angeben"
          />
        </Grid>
      )}
      {type === "DomesticAddress" && (
        <>
          <Grid xxs={12} xs={9}>
            <StreetField
              api={streetApi}
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
            label="Postfachnummer"
            required="Bitte eine Postfachnummer angeben"
            validate={validateLength(1, 21)}
          />
        </Grid>
      )}
      <Grid xxs={12} xs={4}>
        <AddressAutoFillField
          api={streetApi}
          fieldName={fieldName}
          name="postalCode"
          label="Postleitzahl"
          required="Bitte PLZ angeben"
          validate={validatePipe(
            validateZipCode(getValue("country")),
            validateLength(1, 20),
          )}
        />
      </Grid>
      <Grid xxs={12} xs={8}>
        <AddressAutoFillField
          api={streetApi}
          fieldName={fieldName}
          name="city"
          label="Ort"
          required="Bitte einen Ort angeben"
          validate={validateLength(1, 50)}
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
