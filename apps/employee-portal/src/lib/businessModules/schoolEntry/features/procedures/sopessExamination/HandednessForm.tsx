/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { SoftRequiredSelectField } from "@eshg/lib-portal";

import {
  FIXED_WIDTH_STYLE,
  getAbbreviation,
} from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import { HANDEDNESS_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";

export function HandednessForm() {
  return (
    <Stack
      gap={2}
      data-testid="handednessForm"
      role="group"
      aria-labelledby="handedness-label"
    >
      <Typography level="title-sm" component="h2" id="handedness-label">
        Händigkeit
      </Typography>
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
