/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { CountryField } from "@eshg/lib-employee-portal";
import {
  AddressAutoFillField,
  DateField,
  EmailField,
  GENDER_OPTIONS,
  InputField,
  NestedFormProps,
  PhoneNumberField,
  SelectField,
  StreetField,
  createFieldNameMapper,
  useValidateLength,
  useValidatePastOrTodayDate,
  validateDateOfBirth,
  validatePipe,
  validateZipCode,
} from "@eshg/lib-portal";
import {
  MedicalRegistryCreateProcedureFormValues,
  PersonalInformationFormValues,
} from "@eshg/medical-registry";
import { ApiCountryCode, ApiTypeOfChange } from "@eshg/medical-registry-api";

import { useStreetApi } from "@/lib/baseModule/api/clients";
import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";

export function PersonalInformationForm(props: NestedFormProps) {
  const streetApi = useStreetApi();
  const validateLength = useValidateLength();
  const validatePastOrTodayDate = useValidatePastOrTodayDate();
  const values =
    useFormikContext<MedicalRegistryCreateProcedureFormValues>().values;

  const fieldName = createFieldNameMapper<PersonalInformationFormValues>(
    props.name,
  );

  const changeType = values.generalInformationForm.changeType;

  const ctx = useFormikContext<PersonalInformationFormValues>();

  function getCountry() {
    const country =
      ctx.getFieldMeta<PersonalInformationFormValues["country"]>(
        "country",
      ).value;
    return country === "" ? ApiCountryCode.Unknown : country;
  }

  return (
    <>
      <Grid xxs={12}>
        <Typography level="h3" component="h2">
          Angaben zur antragstellenden Person
        </Typography>
      </Grid>

      <Grid xxs={6}>
        <InputField
          name={fieldName("title")}
          label="Titel"
          validate={validateLength(1, 119)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6} xxl={3}>
        <InputField
          name={fieldName("firstName")}
          label="Vorname(n)"
          required={requiredFieldMessage}
          validate={validateLength(1, 120)}
        />
      </Grid>
      <Grid xxs={6} xxl={3}>
        <InputField
          name={fieldName("lastName")}
          label="Nachname"
          required={requiredFieldMessage}
          validate={validateLength(1, 80)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <InputField
          name={fieldName("birthName")}
          label="Geburtsname"
          validate={validateLength(1, 40)}
          required={
            changeType === ApiTypeOfChange.ChangeOfName
              ? requiredFieldMessage
              : undefined
          }
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <SelectField
          name={fieldName("gender")}
          label="Geschlecht"
          options={GENDER_OPTIONS}
          required={requiredFieldMessage}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6} xxl={4.5}>
        <StreetField
          api={streetApi}
          name={fieldName("street")}
          label="Straße"
          required={requiredFieldMessage}
          validate={validateLength(1, 55)}
        />
      </Grid>
      <Grid xxs={6} xxl={1.5}>
        <InputField
          name={fieldName("houseNumber")}
          label="Hausnummer"
          required={requiredFieldMessage}
          validate={validateLength(1, 11)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6} xxl={2}>
        <AddressAutoFillField
          api={streetApi}
          name="postalCode"
          fieldName={fieldName}
          label="Postleitzahl"
          required={requiredFieldMessage}
          validate={validatePipe(
            validateZipCode(getCountry()),
            validateLength(1, 20),
          )}
        />
      </Grid>
      <Grid xxs={6} xxl={4}>
        <AddressAutoFillField
          api={streetApi}
          name="city"
          fieldName={fieldName}
          label="Ort"
          required={requiredFieldMessage}
          validate={validateLength(1, 50)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <CountryField
          name={fieldName("country")}
          label="Land"
          required={requiredFieldMessage}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <PhoneNumberField
          name={fieldName("phoneNumber")}
          label="Telefon"
          required={requiredFieldMessage}
          validate={validateLength(1, 23)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <EmailField
          name={fieldName("email")}
          label="E-Mail-Adresse"
          validate={validateLength(1, 254)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6} xxl={2}>
        <DateField
          name={fieldName("birthDate")}
          label="Geburtsdatum"
          required={requiredFieldMessage}
          validate={validatePipe(validatePastOrTodayDate, validateDateOfBirth)}
        />
      </Grid>
      <Grid xxs={6} xxl={4}>
        <InputField
          name={fieldName("birthPlace")}
          label="Geburtsort"
          required={requiredFieldMessage}
          validate={validateLength(1, 50)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <CountryField
          name={fieldName("nationality")}
          label="Staatsangehörigkeit"
          required={requiredFieldMessage}
        />
      </Grid>
    </>
  );
}
