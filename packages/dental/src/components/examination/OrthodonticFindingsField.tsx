/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { useField } from "formik";

import { ApiOrthodonticFinding } from "@eshg/dental-api";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import { ORTHODONTIC_FINDINGS } from "@/translations/examination";

const ORTHODONTIC_FINDINGS_OPTIONS =
  buildEnumOptions<ApiOrthodonticFinding>(ORTHODONTIC_FINDINGS);

export function OrthodonticFindingsField() {
  const [orthodonticFindings] = useField<string[]>("orthodonticFindings");
  const findings = orthodonticFindings.value;

  const options = ORTHODONTIC_FINDINGS_OPTIONS.map((option) => {
    return {
      value: option.value,
      label: (
        <>
          {findings.includes(option.value) ? (
            <CheckBox color="primary" />
          ) : (
            <CheckBoxOutlineBlank color="neutral" />
          )}
          {option.label}
        </>
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
