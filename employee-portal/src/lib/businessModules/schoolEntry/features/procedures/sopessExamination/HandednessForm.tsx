/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SoftRequiredSelectField } from "@eshg/lib-portal/components/form/fieldVariants";
import { Stack, Typography } from "@mui/joy";

import {
  FIXED_WIDTH_STYLE,
  getAbbreviation,
} from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import { HANDEDNESS_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";

export function HandednessForm() {
  return (
    <Stack gap={2} data-testid="handednessForm">
      <Typography level="title-sm">Händigkeit</Typography>
      <SoftRequiredSelectField
        name="handedness"
        label="Ergebnis"
        options={HANDEDNESS_OPTIONS}
        renderValue={getAbbreviation}
        sx={FIXED_WIDTH_STYLE}
      />
    </Stack>
  );
}
