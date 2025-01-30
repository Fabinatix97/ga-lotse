/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MedicalRegistryCreateProcedureFormValues,
  PracticeInformationFormValues,
} from "@eshg/lib-portal/businessModules/medicalRegistry/medicalRegistryCreateProcedureFormValues";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { BooleanRadioField } from "@eshg/lib-portal/components/formFields/BooleanRadioField";
import { EmailField } from "@eshg/lib-portal/components/formFields/EmailField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import {
  validateLength,
  validateNumber,
} from "@eshg/lib-portal/helpers/validators";
import { NestedFormProps } from "@eshg/lib-portal/types/form";
import { Grid, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";

interface PracticeInformationFormProps extends NestedFormProps {
  forceProprietaryPractice: boolean;
}

export function PracticeInformationForm(props: PracticeInformationFormProps) {
  const values =
    useFormikContext<MedicalRegistryCreateProcedureFormValues>().values;

  const fieldName = createFieldNameMapper<PracticeInformationFormValues>(
    props.name,
  );

  const proprietaryPractice =
    values.practiceInformationForm.proprietaryPractice;

  return (
    <>
      <Grid xxs={12}>
        <Typography level="h3">Praxis-/Tätigkeitsangaben</Typography>
      </Grid>
      {props.forceProprietaryPractice ? (
        <>
          <Grid xxs={6}>
            <Alert
              color="primary"
              message="Für die ausgewählte Änderungsart ist nur eine eigene Praxis / Niederlassung möglich."
            />
          </Grid>
          <Grid xxl={6} />
        </>
      ) : (
        <Grid xxs={12}>
          <BooleanRadioField
            name={fieldName("proprietaryPractice")}
            label="Eigene Praxis / Niederlassung"
          />
        </Grid>
      )}

      {(props.forceProprietaryPractice || proprietaryPractice) && (
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
              validate={validateLength(1, 254)}
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
