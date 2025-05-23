/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Radio, Typography } from "@mui/joy";

import {
  NestedFormProps,
  RadioGroupField,
  createFieldNameMapper,
} from "@eshg/lib-portal";
import {
  employmentStatusNames,
  employmentTypeNames,
} from "@eshg/lib-portal/businessModules/medicalRegistry/constants";
import { ProfessionalismInformationFormValues } from "@eshg/lib-portal/businessModules/medicalRegistry/medicalRegistryCreateProcedureFormValues";
import {
  ApiEmploymentStatus,
  ApiEmploymentType,
} from "@eshg/medical-registry-api";

import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";

export function ProfessionalismInformationForm(props: NestedFormProps) {
  const fieldName = createFieldNameMapper<ProfessionalismInformationFormValues>(
    props.name,
  );

  return (
    <>
      <Grid xxs={12}>
        <Typography level="h3" component="h2">
          Angaben zur Berufsausübung
        </Typography>
      </Grid>
      <Grid xxs={12}>
        <RadioGroupField
          name={fieldName("employmentType")}
          label="Beschäftigungsart"
          orientation="horizontal"
          required={requiredFieldMessage}
        >
          <Radio
            value={ApiEmploymentType.FullTime}
            label={employmentTypeNames[ApiEmploymentType.FullTime]}
          />
          <Radio
            value={ApiEmploymentType.PartTime}
            label={employmentTypeNames[ApiEmploymentType.PartTime]}
          />
        </RadioGroupField>
      </Grid>
      <Grid xxs={12}>
        <RadioGroupField
          name={fieldName("employmentStatus")}
          label="Beschäftigungsstatus"
          orientation="horizontal"
          required={requiredFieldMessage}
        >
          <Radio
            value={ApiEmploymentStatus.SelfEmployed}
            label={employmentStatusNames[ApiEmploymentStatus.SelfEmployed]}
          />
          <Radio
            value={ApiEmploymentStatus.Freelance}
            label={employmentStatusNames[ApiEmploymentStatus.Freelance]}
          />
          <Radio
            value={ApiEmploymentStatus.Employee}
            label={employmentStatusNames[ApiEmploymentStatus.Employee]}
          />
        </RadioGroupField>
      </Grid>
    </>
  );
}
