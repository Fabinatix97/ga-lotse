/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiEmploymentStatus,
  ApiEmploymentType,
} from "@eshg/employee-portal-api/medicalRegistry";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { NestedFormProps } from "@eshg/lib-portal/types/form";
import { Grid, Radio, Typography } from "@mui/joy";

import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";
import {
  employmentStatusNames,
  employmentTypeNames,
} from "@/lib/businessModules/medicalRegistry/shared/constants";
import { RadioGroupField } from "@/lib/shared/components/formFields/RadioGroupField";

export interface ProfessionalismInformationFormValues {
  employmentType: ApiEmploymentType;
  employmentStatus: ApiEmploymentStatus;
}

export function ProfessionalismInformationForm(props: NestedFormProps) {
  const fieldName = createFieldNameMapper<ProfessionalismInformationFormValues>(
    props.name,
  );

  return (
    <>
      <Grid xxs={12}>
        <Typography level="h3">Angaben zur Berufsausübung</Typography>
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
