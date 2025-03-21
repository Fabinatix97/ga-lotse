/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiOrthodonticFinding } from "@eshg/dental-api";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { Checkbox, Chip } from "@mui/joy";
import { useField } from "formik";

import { ORTHODONTIC_FINDINGS_OPTIONS } from "@/lib/businessModules/dental/features/examinations/AdditionalInformationFormSection";
import { ORTHODONTIC_FINDINGS } from "@/lib/businessModules/dental/features/examinations/translations";

export function OrthodonticFindingsField() {
  const [orthodonticFindings] = useField<string[]>("orthodonticFindings");
  const findings = orthodonticFindings.value;

  const options = ORTHODONTIC_FINDINGS_OPTIONS.map((option) => {
    return {
      value: option.value,
      label: (
        <Checkbox
          checked={findings.includes(option.value)}
          label={option.label}
        />
      ),
    };
  });

  const valueItems = findings.map((finding) => (
    <Chip key={finding} color="primary" sx={{ marginRight: 0.5 }}>
      {ORTHODONTIC_FINDINGS[finding as ApiOrthodonticFinding]}
    </Chip>
  ));

  return (
    <SelectField
      name="orthodonticFindings"
      label="KFO-Anomalien"
      options={options}
      multiple={true}
      renderValue={() => valueItems}
    />
  );
}
