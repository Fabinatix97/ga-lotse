/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import {
  SoftRequiredBooleanSelectField,
  SoftRequiredSelectField,
} from "@eshg/lib-portal";

import { getAbbreviation } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import {
  SCHOOL_FEEDBACK_OPTIONS,
  SCHOOL_RECOMMENDATION_OPTIONS,
} from "@/lib/businessModules/schoolEntry/features/procedures/options";
import {
  BOLD_LABEL_STYLE,
  FIXED_WIDTH_BOOLEAN_SELECT_STYLE,
} from "@/lib/businessModules/schoolEntry/features/procedures/styles";

const OFFSET_STYLE: SxProps = { marginLeft: "238px" };

export function DevelopmentScreeningResultFields() {
  return (
    <Stack direction="row" gap={3} flexWrap="wrap" sx={OFFSET_STYLE}>
      <SoftRequiredSelectField
        name="schoolRecommendation"
        label="Empfehlungen"
        options={SCHOOL_RECOMMENDATION_OPTIONS}
        renderValue={getAbbreviation}
        sx={{ ...FIXED_WIDTH_BOOLEAN_SELECT_STYLE, ...BOLD_LABEL_STYLE }}
        softRequired
      />
      <SoftRequiredBooleanSelectField
        name="extraEffort"
        label="Mehraufwand"
        sx={{ ...FIXED_WIDTH_BOOLEAN_SELECT_STYLE, ...BOLD_LABEL_STYLE }}
        allowDeselection
        softRequired
      />
      <SoftRequiredSelectField
        name="schoolFeedback"
        label="RM Schule"
        options={SCHOOL_FEEDBACK_OPTIONS}
        renderValue={getAbbreviation}
        sx={{ ...FIXED_WIDTH_BOOLEAN_SELECT_STYLE, ...BOLD_LABEL_STYLE }}
      />
    </Stack>
  );
}
