/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProfessionalTitle } from "@eshg/employee-portal-api/medicalRegistry";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  buildEnumOptions,
  createFieldNameMapper,
} from "@eshg/lib-portal/helpers/form";
import {
  NestedFormProps,
  OptionalFieldValue,
} from "@eshg/lib-portal/types/form";
import { Grid, Typography } from "@mui/joy";

import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";
import { lifetimeDoctorNumberValidator } from "@/lib/businessModules/medicalRegistry/components/procedures/create/validator";
import { professionalTitleNames } from "@/lib/businessModules/medicalRegistry/shared/constants";

export interface OccupationalInformationFormValues {
  professionalTitle: OptionalFieldValue<ApiProfessionalTitle>;
  fieldOfExpertise: OptionalFieldValue<string>;
  specialistTitle: OptionalFieldValue<string>;
  furtherTraining: OptionalFieldValue<string>;
  qualifications: OptionalFieldValue<string>;
  approbationGrantedOn: OptionalFieldValue<Date>;
  approbationIssuingAuthority: string;
  lifetimeDoctorNumber: OptionalFieldValue<string>;
}

export function OccupationalInformationForm(props: NestedFormProps) {
  const fieldName = createFieldNameMapper<OccupationalInformationFormValues>(
    props.name,
  );

  return (
    <>
      <Grid xxs={12}>
        <Typography level="h3">Berufsangaben</Typography>
      </Grid>
      <Grid xxs={6}>
        <SelectField
          name={fieldName("professionalTitle")}
          label="Berufsbezeichnung"
          options={buildEnumOptions(professionalTitleNames)}
          required={requiredFieldMessage}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <InputField name={fieldName("fieldOfExpertise")} label="Fachgebiet" />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <InputField
          name={fieldName("specialistTitle")}
          label="Facharztbezeichnung"
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <InputField name={fieldName("furtherTraining")} label="Weiterbildung" />
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
          required={requiredFieldMessage}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <InputField
          name={fieldName("approbationIssuingAuthority")}
          label="Ausstellungsbehörde"
          required={requiredFieldMessage}
        />
      </Grid>
      <Grid xxl={6} />

      <Grid xxs={6}>
        <InputField
          name={fieldName("lifetimeDoctorNumber")}
          label="Lebenslange Arztnummer (LAN)"
          validate={lifetimeDoctorNumberValidator}
        />
      </Grid>
      <Grid xxl={6} />
    </>
  );
}
