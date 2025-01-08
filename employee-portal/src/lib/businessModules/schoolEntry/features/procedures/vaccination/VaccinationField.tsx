/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SoftRequiredNumberField } from "@eshg/lib-portal/businessModules/schoolEntry/features/procedures/fieldVariants";
import {
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal/helpers/validators";
import { OptionalFieldValue, Validator } from "@eshg/lib-portal/types/form";
import { SxProps } from "@mui/joy/styles/types";

export const VACCINATION_FIELD_STYLE: SxProps = { width: "160px" };

interface VaccinationFieldProps {
  name: string;
  label: string;
  softRequired?: boolean;
  required?: string;
  validate?: Validator<OptionalFieldValue<number>>;
  min?: number;
  max?: number;
}

export function VaccinationField(props: VaccinationFieldProps) {
  return (
    <SoftRequiredNumberField
      key={props.name}
      name={props.name}
      label={props.label}
      orientation="vertical"
      sx={VACCINATION_FIELD_STYLE}
      softRequired={props.softRequired}
      validate={props.validate ?? validateIntegerAnd(validateRange(0, 9))}
      min={props.min ?? 0}
      max={props.max ?? 9}
      required={props.required}
    ></SoftRequiredNumberField>
  );
}
