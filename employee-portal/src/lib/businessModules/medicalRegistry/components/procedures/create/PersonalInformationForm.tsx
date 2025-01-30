/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTypeOfChange } from "@eshg/employee-portal-api/medicalRegistry";
import {
  MedicalRegistryCreateProcedureFormValues,
  PersonalInformationFormValues,
} from "@eshg/lib-portal/businessModules/medicalRegistry/medicalRegistryCreateProcedureFormValues";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { EmailField } from "@eshg/lib-portal/components/formFields/EmailField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { PhoneNumberField } from "@eshg/lib-portal/components/formFields/PhoneNumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { GENDER_OPTIONS } from "@eshg/lib-portal/components/formFields/constants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import {
  validateLength,
  validatePastOrTodayDate,
} from "@eshg/lib-portal/helpers/validators";
import { NestedFormProps } from "@eshg/lib-portal/types/form";
import { Grid, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";
import { CountryField } from "@/lib/shared/components/formFields/CountryField";

export function PersonalInformationForm(props: NestedFormProps) {
  const values =
    useFormikContext<MedicalRegistryCreateProcedureFormValues>().values;

  const fieldName = createFieldNameMapper<PersonalInformationFormValues>(
    props.name,
  );

  const changeType = values.generalInformationForm.changeType;

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
        <CountryField
          name={fieldName("country")}
          label={"Land"}
          required={requiredFieldMessage}
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
          label={"E-Mail-Adresse"}
          validate={validateLength(1, 254)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6} xxl={2}>
        <DateField
          name={fieldName("birthDate")}
          label={"Geburtsdatum"}
          required={requiredFieldMessage}
          validate={validatePastOrTodayDate}
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
        <CountryField
          name={fieldName("nationality")}
          label={"Staatsangehörigkeit"}
          required={requiredFieldMessage}
        />
      </Grid>
    </>
  );
}
