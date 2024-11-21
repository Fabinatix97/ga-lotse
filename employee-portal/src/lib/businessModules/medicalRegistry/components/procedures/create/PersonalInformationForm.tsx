/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCountryCode, ApiGender } from "@eshg/employee-portal-api/base";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import {
  NestedFormProps,
  OptionalFieldValue,
} from "@eshg/lib-portal/types/form";
import { Grid, Typography } from "@mui/joy";

import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";
import { COUNTRY_CODE_OPTIONS } from "@/lib/businessModules/stiProtection/shared/countryCodes";
import { EmailField } from "@/lib/shared/components/formFields/EmailField";
import { PhoneNumberField } from "@/lib/shared/components/formFields/PhoneNumberField";
import { GENDER_OPTIONS } from "@/lib/shared/components/personSidebar/constants";

export interface PersonalInformationFormValues {
  title: OptionalFieldValue<string>;
  firstName: string;
  lastName: string;
  birthName: string;
  gender: OptionalFieldValue<ApiGender>;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: OptionalFieldValue<ApiCountryCode>;
  phoneNumber: string;
  email: string;
  birthDate: OptionalFieldValue<Date>;
  birthPlace: string;
  nationality: OptionalFieldValue<ApiCountryCode>;
}

export function PersonalInformationForm(props: NestedFormProps) {
  const fieldName = createFieldNameMapper<PersonalInformationFormValues>(
    props.name,
  );

  return (
    <>
      <Grid xxs={12}>
        <Typography level="h3">Angaben zur antragstellenden Person</Typography>
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
          label={"Vorname(n)"}
          required={requiredFieldMessage}
          validate={validateLength(1, 120)}
        />
      </Grid>
      <Grid xxs={6} xxl={3}>
        <InputField
          name={fieldName("lastName")}
          label={"Nachname"}
          required={requiredFieldMessage}
          validate={validateLength(1, 80)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <InputField
          name={fieldName("birthName")}
          label={"Geburtsname"}
          required={requiredFieldMessage}
          validate={validateLength(1, 40)}
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
        <InputField
          name={fieldName("street")}
          label={"Straße"}
          required={requiredFieldMessage}
          validate={validateLength(1, 55)}
        />
      </Grid>
      <Grid xxs={6} xxl={1.5}>
        <InputField
          name={fieldName("houseNumber")}
          label={"Hausnummer"}
          required={requiredFieldMessage}
          validate={validateLength(1, 11)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6} xxl={2}>
        <InputField
          name={fieldName("postalCode")}
          label={"Postleitzahl"}
          required={requiredFieldMessage}
          validate={validateLength(1, 20)}
        />
      </Grid>
      <Grid xxs={6} xxl={4}>
        <InputField
          name={fieldName("city")}
          label={"Ort"}
          required={requiredFieldMessage}
          validate={validateLength(1, 50)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <SelectField
          name={fieldName("country")}
          label={"Land"}
          required={requiredFieldMessage}
          options={COUNTRY_CODE_OPTIONS}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <PhoneNumberField
          name={fieldName("phoneNumber")}
          label={"Telefon"}
          required={requiredFieldMessage}
          validate={validateLength(1, 23)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <EmailField
          name={fieldName("email")}
          label={"Email"}
          required={requiredFieldMessage}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6} xxl={2}>
        <DateField
          name={fieldName("birthDate")}
          label={"Geburtsdatum"}
          required={requiredFieldMessage}
        />
      </Grid>
      <Grid xxs={6} xxl={4}>
        <InputField
          name={fieldName("birthPlace")}
          label={"Geburtsort"}
          required={requiredFieldMessage}
          validate={validateLength(1, 50)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <SelectField
          name={fieldName("nationality")}
          label={"Staatsangehörigkeit"}
          required={requiredFieldMessage}
          options={COUNTRY_CODE_OPTIONS}
        />
      </Grid>
    </>
  );
}
