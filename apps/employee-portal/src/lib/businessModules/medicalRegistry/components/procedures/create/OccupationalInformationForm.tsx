/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import {
  DateField,
  InputField,
  NestedFormProps,
  SelectField,
  buildEnumOptions,
  createFieldNameMapper,
  useValidateLength,
  useValidatePastOrTodayDate,
} from "@eshg/lib-portal";
import {
  MedicalRegistryCreateProcedureFormValues,
  OccupationalInformationFormValues,
  PROFESSIONAL_TITLE_NAMES,
  useValidateLifetimeDoctorNumber,
} from "@eshg/medical-registry";
import { ApiTypeOfChange } from "@eshg/medical-registry-api";

import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";

export function OccupationalInformationForm(props: NestedFormProps) {
  const validateLength = useValidateLength();
  const validatePastOrTodayDate = useValidatePastOrTodayDate();
  const validateLifetimeDoctorNumber = useValidateLifetimeDoctorNumber();
  const values =
    useFormikContext<MedicalRegistryCreateProcedureFormValues>().values;

  const fieldName = createFieldNameMapper<OccupationalInformationFormValues>(
    props.name,
  );

  const changeType = values.generalInformationForm.changeType;

  return (
    <>
      <Grid xxs={12}>
        <Typography level="h3" component="h2">
          Berufsangaben
        </Typography>
      </Grid>
      <Grid xxs={6}>
        <SelectField
          name={fieldName("professionalTitle")}
          label="Berufsbezeichnung"
          options={buildEnumOptions(PROFESSIONAL_TITLE_NAMES).sort((a, b) =>
            a.label.localeCompare(b.label),
          )}
          required={requiredFieldMessage}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <InputField
          name={fieldName("fieldOfExpertise")}
          label="Fachgebiet"
          validate={validateLength(1, 100)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <InputField
          name={fieldName("specialistTitle")}
          label="Facharztbezeichnung"
          validate={validateLength(1, 100)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <InputField
          name={fieldName("furtherTraining")}
          label="Weiterbildung"
          validate={validateLength(1, 300)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <InputField name={fieldName("qualifications")} label="Qualifizierung" />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <DateField
          name={fieldName("approbationGrantedOn")}
          label="Erlaubnis / Approbation erteilt am"
          required={
            changeType === ApiTypeOfChange.NewRegistration ||
            changeType === ApiTypeOfChange.ReRegistration
              ? requiredFieldMessage
              : undefined
          }
          validate={validatePastOrTodayDate}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <InputField
          name={fieldName("approbationIssuingAuthority")}
          label="Ausstellungsbehörde"
          required={requiredFieldMessage}
          validate={validateLength(1, 100)}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <InputField
          name={fieldName("lifetimeDoctorNumber")}
          label="Lebenslange Arztnummer (LAN)"
          validate={validateLifetimeDoctorNumber}
        />
      </Grid>
      <Grid xxl={6} />
    </>
  );
}
