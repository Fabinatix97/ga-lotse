/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiCountryCode, ApiGender, ApiSalutation } from "@eshg/base-api";
import { FormAddMoreButton } from "@eshg/lib-portal/components/form/FormAddMoreButton";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { EmailField } from "@eshg/lib-portal/components/formFields/EmailField";
import {
  InputArrayField,
  getIndexLabel,
} from "@eshg/lib-portal/components/formFields/InputArrayField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  GENDER_OPTIONS,
  PERSON_FIELD_NAME,
  SALUTATION_OPTIONS,
  TITLE_OPTIONS,
} from "@eshg/lib-portal/components/formFields/constants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Box, Divider, Grid, IconButton, Stack, Typography } from "@mui/joy";
import { isNonNullish } from "remeda";

import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { ContactAddressForm } from "@/lib/shared/components/form/address/BaseAddressForm";
import {
  BaseAddressFormInputs,
  createEmptyAddress,
} from "@/lib/shared/components/form/address/helpers";
import { CountryField } from "@/lib/shared/components/formFields/CountryField";
import {
  PersonFormProps,
  PersonFormValues,
} from "@/lib/shared/components/personSidebar/form/PersonSidebarForm";
import { SearchPersonFormValues } from "@/lib/shared/components/personSidebar/search/SearchPersonSidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

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
  const fieldName = createFieldNameMapper<DefaultPersonFormValues>();

  return (
    <>
      <SidebarContent title={props.title} subtitle={props.subtitle}>
        <Stack gap={3}>
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
              props.mode === "edit" ? "Bitte einen Vornamen angeben" : undefined
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

          <Divider />

          {isNonNullish(props.values.contactAddress) ? (
            <Box
              component={"section"}
              aria-labelledby={"contact-address-section-title"}
              sx={{ display: "contents" }}
            >
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography
                  level={"title-md"}
                  sx={{ flex: 1 }}
                  id={"contact-address-section-title"}
                >
                  Kontaktadresse
                </Typography>
                {props.addressRequired !== true && (
                  <IconButton
                    onClick={() =>
                      props.setFieldValue(
                        fieldName("contactAddress"),
                        undefined,
                        false,
                      )
                    }
                    aria-label={"Kontaktadresse entfernen"}
                    sx={{ alignSelf: "flex-end" }}
                    color={"danger"}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Stack>
              <Grid container spacing={2}>
                <ContactAddressForm
                  name={fieldName("contactAddress")}
                  type={props.values.contactAddress.type}
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

          <section aria-label={"E-Mail-Adressen"}>
            <InputArrayField
              name={fieldName("emailAddresses")}
              addMoreLabel={"E-Mail-Adresse hinzufügen"}
              fieldComponent={EmailField}
              label={(index) =>
                getIndexLabel(PERSON_FIELD_NAME.emailAddresses, index)
              }
              validateEach={validateLength(6, 254)}
            />
          </section>

          <section aria-label={"Telefonnummern"}>
            <InputArrayField
              name={fieldName("phoneNumbers")}
              addMoreLabel={"Telefonnummer hinzufügen"}
              label={(index) =>
                getIndexLabel(PERSON_FIELD_NAME.phoneNumbers, index)
              }
              validateEach={validateLength(1, 23)}
            />
          </section>
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
