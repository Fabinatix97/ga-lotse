/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeleteOutlined } from "@mui/icons-material";
import { Box, Divider, Grid, IconButton, Stack, Typography } from "@mui/joy";
import { isNonNullish } from "remeda";

import { ApiCountryCode, ApiGender, ApiSalutation } from "@eshg/base-api";
import {
  DateField,
  EmailField,
  FormAddMoreButton,
  GENDER_OPTIONS,
  InputArrayField,
  InputField,
  OptionalFieldValue,
  PERSON_FIELD_NAME,
  SALUTATION_OPTIONS,
  SelectField,
  TITLE_OPTIONS,
  createFieldNameMapper,
  getIndexLabel,
  useValidateLength,
  validateDateOfBirth,
} from "@eshg/lib-portal";

import {
  BaseAddressFormInputs,
  ContactAddressForm,
} from "../../../../components/address/addressForms";
import { createEmptyAddress } from "../../../../components/address/helpers";
import { MultiFormButtonBar } from "../../../../components/form/MultiFormButtonBar";
import { CountryField } from "../../../../components/formFields/CountryField";
import { SidebarActions } from "../../../drawer/components/SidebarActions";
import { SidebarContent } from "../../../drawer/components/SidebarContent";
import { PersonFormProps, PersonFormValues } from "../../types/personForm";
import { SearchPersonFormValues } from "../search/SearchPersonSidebar";

export interface DefaultPersonFormValues extends PersonFormValues {
  gender: OptionalFieldValue<ApiGender>;
  salutation: OptionalFieldValue<ApiSalutation>;
  title: string;
  nameAtBirth: string;
  placeOfBirth: string;
  countryOfBirth: OptionalFieldValue<ApiCountryCode>;
  emailAddresses: string[];
  phoneNumbers: string[];
  contactAddress?: BaseAddressFormInputs;
  differentBillingAddress?: BaseAddressFormInputs;
}

export function defaultPersonFormValues({
  inputs,
  addressRequired,
}: {
  inputs: SearchPersonFormValues;
  addressRequired?: boolean;
}): DefaultPersonFormValues {
  return {
    firstName: inputs.firstName,
    lastName: inputs.lastName,
    dateOfBirth: inputs.dateOfBirth,
    title: "",
    salutation: "",
    gender: "",
    nameAtBirth: "",
    placeOfBirth: "",
    countryOfBirth: "",
    emailAddresses: [""],
    phoneNumbers: [""],
    contactAddress: addressRequired ? createEmptyAddress() : undefined,
    differentBillingAddress: undefined,
  };
}

export function DefaultPersonForm<TValues extends DefaultPersonFormValues>(
  props: PersonFormProps<TValues>,
) {
  const validateLength = useValidateLength();
  const fieldName = createFieldNameMapper<DefaultPersonFormValues>();

  return (
    <>
      <SidebarContent title={props.title} subtitle={props.subtitle}>
        <Stack gap={3}>
          <Stack gap={3} role="group" aria-label="Personendaten">
            <Grid container spacing={2}>
              <Grid xxs>
                <SelectField
                  name={fieldName("salutation")}
                  label={PERSON_FIELD_NAME.salutation}
                  options={SALUTATION_OPTIONS}
                />
              </Grid>
              <Grid xxs>
                <SelectField
                  name={fieldName("title")}
                  label={PERSON_FIELD_NAME.title}
                  options={TITLE_OPTIONS}
                />
              </Grid>
            </Grid>

            <InputField
              name={fieldName("firstName")}
              label={PERSON_FIELD_NAME.firstName}
              readOnly={props.mode !== "edit"}
              required={
                props.mode === "edit"
                  ? "Bitte einen Vornamen angeben"
                  : undefined
              }
              validate={validateLength(1, 80)}
            />
            <InputField
              name={fieldName("lastName")}
              label={PERSON_FIELD_NAME.lastName}
              readOnly={props.mode !== "edit"}
              required={
                props.mode === "edit" ? "Bitte einen Namen angeben" : undefined
              }
              validate={validateLength(1, 120)}
            />

            <Grid container spacing={2}>
              <Grid xxs>
                <DateField
                  name={fieldName("dateOfBirth")}
                  label={PERSON_FIELD_NAME.dateOfBirth}
                  readOnly={props.mode !== "edit"}
                  required={
                    props.mode === "edit"
                      ? "Bitte ein Geburtsdatum angeben"
                      : undefined
                  }
                  validate={validateDateOfBirth}
                />
              </Grid>
              <Grid xxs>
                <SelectField
                  name={fieldName("gender")}
                  label={PERSON_FIELD_NAME.gender}
                  options={GENDER_OPTIONS}
                />
              </Grid>
            </Grid>

            <InputField
              name={fieldName("nameAtBirth")}
              label={PERSON_FIELD_NAME.nameAtBirth}
              validate={validateLength(1, 40)}
            />

            <InputField
              name={fieldName("placeOfBirth")}
              label={PERSON_FIELD_NAME.placeOfBirth}
              validate={validateLength(1, 50)}
            />

            <CountryField
              name={fieldName("countryOfBirth")}
              label={PERSON_FIELD_NAME.countryOfBirth}
            />
          </Stack>

          <Divider />

          {isNonNullish(props.values.contactAddress) ? (
            <Box
              role="group"
              aria-labelledby="contact-address-section-title"
              sx={{ display: "contents" }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  level="title-md"
                  sx={{ flex: 1 }}
                  id="contact-address-section-title"
                  component="h2"
                >
                  Kontaktadresse
                </Typography>
                {props.addressRequired !== true && (
                  <IconButton
                    aria-label="Kontaktadresse entfernen"
                    sx={{ alignSelf: "flex-end" }}
                    color="danger"
                    onClick={() =>
                      props.setFieldValue(
                        fieldName("contactAddress"),
                        undefined,
                        false,
                      )
                    }
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </Stack>
              <Grid container spacing={2}>
                <ContactAddressForm
                  name={fieldName("contactAddress")}
                  type={props.values.contactAddress.type}
                  canChooseType={props.canChooseAddressType}
                />
              </Grid>
            </Box>
          ) : (
            <FormAddMoreButton
              onClick={() =>
                props.setFieldValue(
                  fieldName("contactAddress"),
                  createEmptyAddress(),
                  false,
                )
              }
            >
              Kontaktadresse hinzufügen
            </FormAddMoreButton>
          )}

          <Divider />

          <div role="group" aria-label="E-Mail-Adressen">
            <InputArrayField
              name={fieldName("emailAddresses")}
              addMoreLabel="E-Mail-Adresse hinzufügen"
              fieldComponent={EmailField}
              label={(index) =>
                getIndexLabel(PERSON_FIELD_NAME.emailAddresses, index)
              }
              validateEach={validateLength(6, 254)}
            />
          </div>

          <div role="group" aria-label="Telefonnummern">
            <InputArrayField
              name={fieldName("phoneNumbers")}
              addMoreLabel="Telefonnummer hinzufügen"
              label={(index) =>
                getIndexLabel(PERSON_FIELD_NAME.phoneNumbers, index)
              }
              validateEach={validateLength(1, 23)}
            />
          </div>
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <MultiFormButtonBar
          submitting={props.isSubmitting}
          submitLabel={props.submitLabel}
          onBack={props.onBack}
          onCancel={props.onCancel}
          onDelete={props.onDelete}
        />
      </SidebarActions>
    </>
  );
}
