/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SoftRequiredSelectField } from "@eshg/lib-portal/components/form/fieldVariants";

import {
  FIXED_WIDTH_STYLE,
  getAbbreviation,
} from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import { ARTICULATION_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";

interface ArticulationFieldProps {
  name: string;
  label: string;
}

export function ArticulationField(props: ArticulationFieldProps) {
  return (
    <SoftRequiredSelectField
      name={props.name}
      label={props.label}
      options={ARTICULATION_OPTIONS}
      renderValue={getAbbreviation}
      sx={FIXED_WIDTH_STYLE}
      softRequired
    />
  );
}
