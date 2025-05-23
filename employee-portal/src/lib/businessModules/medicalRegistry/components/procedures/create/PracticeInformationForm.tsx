/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import {
  Alert,
  BooleanRadioField,
  EmailField,
  InputField,
  NestedFormProps,
  createFieldNameMapper,
  useValidateLength,
  useValidateNumber,
} from "@eshg/lib-portal";
import {
  MedicalRegistryCreateProcedureFormValues,
  PracticeInformationFormValues,
} from "@eshg/lib-portal/businessModules/medicalRegistry/medicalRegistryCreateProcedureFormValues";

import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";

interface PracticeInformationFormProps extends NestedFormProps {
  forceProprietaryPractice: boolean;
}

export function PracticeInformationForm(props: PracticeInformationFormProps) {
  const validateLength = useValidateLength();
  const validateNumber = useValidateNumber();
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
        <Typography level="h3" component="h2">
          Praxis-/Tätigkeitsangaben
        </Typography>
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
              label="Praxisname / Einrichtungsname"
              required={requiredFieldMessage}
              validate={validateLength(1, 300)}
            />
          </Grid>
          <Grid xxl={6} />

          <Grid xxs={6} xxl={4.5}>
            <InputField
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
            <InputField
              name={fieldName("postalCode")}
              label="Postleitzahl"
              required={requiredFieldMessage}
              validate={validateLength(1, 20)}
            />
          </Grid>
          <Grid xxs={6} xxl={4}>
            <InputField
              name={fieldName("city")}
              label="Ort"
              required={requiredFieldMessage}
              validate={validateLength(1, 50)}
            />
          </Grid>
          <Grid xxl={6} />

          <Grid xxs={6}>
            <InputField
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
              label="Email"
              required={requiredFieldMessage}
              validate={validateLength(1, 254)}
            />
          </Grid>
          <Grid xxl={6} />

          <Grid xxs={6}>
            <InputField
              name={fieldName("website")}
              label="Website"
              validate={validateLength(6, 254)}
            />
          </Grid>
          <Grid xxl={6} />

          <Grid xxs={6}>
            <InputField
              name={fieldName("openingHours")}
              label="Öffnungszeiten / Sprechzeiten"
            />
          </Grid>
          <Grid xxl={6} />

          <Grid xxs={6}>
            <InputField
              name={fieldName("institutionIdentifier")}
              label="InstitutionsKennzeichen (IK)"
              validate={validateNumber}
            />
          </Grid>
          <Grid xxl={6} />

          <Grid xxs={6}>
            <InputField
              name={fieldName("establishmentNumber")}
              label="Betriebsstättennummer (BSNR)"
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
