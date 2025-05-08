/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { SoftRequiredSelectField } from "@eshg/lib-portal/components/form/fieldVariants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { NestedFormProps } from "@eshg/lib-portal/types/form";

import { FlexLabel } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FlexLabel";
import { StatusChip } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/StatusChip";
import { COUNTRY_CODE_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";

interface CountryWithNumberFieldProps extends NestedFormProps {
  name: string;
  label: string;
  countryCode?: number;
  onChange: (value: string) => void;
}

const FIXED_WIDTH_STYLE: SxProps = {
  "--FormLabel-margin": "0 16px 0 0",
  ".MuiSelect-root": { width: "195px" },
  width: "410px",
};

export function CountryWithNumberField(props: CountryWithNumberFieldProps) {
  const fieldName = createFieldNameMapper("migrationBackground");

  return (
    <Stack direction="row" gap={2}>
      <SoftRequiredSelectField
        name={fieldName(props.name)}
        label={<FlexLabel>{props.label}</FlexLabel>}
        options={COUNTRY_CODE_OPTIONS}
        sx={FIXED_WIDTH_STYLE}
        softRequired
        onChange={props.onChange}
      />
      <StatusChip aria-label={`Ländergruppe ${props.label}`} minWidth="lg">
        {props.countryCode}
      </StatusChip>
    </Stack>
  );
}
