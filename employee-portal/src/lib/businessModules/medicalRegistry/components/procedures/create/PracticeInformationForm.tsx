/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BooleanRadioField } from "@eshg/lib-portal/components/formFields/BooleanRadioField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import {
  validateLength,
  validateNumber,
} from "@eshg/lib-portal/helpers/validators";
import {
  NestedFormProps,
  OptionalFieldValue,
} from "@eshg/lib-portal/types/form";
import { Grid, Typography } from "@mui/joy";
import { useField } from "formik";

import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";
import { EmailField } from "@/lib/shared/components/formFields/EmailField";

export interface PracticeInformationFormValues {
  proprietaryPractice: boolean;
  practiceName: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  email: string;
  website: OptionalFieldValue<string>;
  openingHours: OptionalFieldValue<string>;
  institutionIdentifier: OptionalFieldValue<string>;
  establishmentNumber: OptionalFieldValue<string>;
  healthInsuranceAuthorization: boolean;
}

export function PracticeInformationForm(props: NestedFormProps) {
  const fieldName = createFieldNameMapper<PracticeInformationFormValues>(
    props.name,
  );

  const [proprietaryPractice] = useField<boolean>(
    fieldName("proprietaryPractice"),
  );

  return (
    <>
      <Grid xxs={12}>
        <Typography level="h3">Praxis-/Tätigkeitsangaben</Typography>
      </Grid>
      <Grid xxs={12}>
        <BooleanRadioField
          name={fieldName("proprietaryPractice")}
          label="Eigene Praxis / Niederlassung"
        />
      </Grid>

      {proprietaryPractice.value && (
        <>
          <Grid xxs={6}>
            <InputField
              name={fieldName("practiceName")}
              label={"Praxisname / Einrichtungsname"}
              required={requiredFieldMessage}
              validate={validateLength(1, 300)}
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
            <InputField
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

          <Grid xxs={6}>
            <InputField
              name={fieldName("website")}
              label={"Website"}
              validate={validateLength(6, 254)}
            />
          </Grid>
          <Grid xxl={6} />

          <Grid xxs={6}>
            <InputField
              name={fieldName("openingHours")}
              label={"Öffnungszeiten / Sprechzeiten"}
            />
          </Grid>
          <Grid xxl={6} />

          <Grid xxs={6}>
            <InputField
              name={fieldName("institutionIdentifier")}
              label={"InstitutionsKennzeichen (IK)"}
              validate={validateNumber}
            />
          </Grid>
          <Grid xxl={6} />

          <Grid xxs={6}>
            <InputField
              name={fieldName("establishmentNumber")}
              label={"Betriebsstättennummer (BSNR)"}
              validate={validateNumber}
            />
          </Grid>
          <Grid xxl={6} />

          <Grid xxs={6}>
            <BooleanRadioField
              name={fieldName("healthInsuranceAuthorization")}
              label="Kassenzulassung"
            />
          </Grid>
        </>
      )}
    </>
  );
}
