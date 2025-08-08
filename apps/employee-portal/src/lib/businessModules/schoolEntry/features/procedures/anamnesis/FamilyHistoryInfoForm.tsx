/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";

import {
  BooleanSelectField,
  HorizontalField,
  InputField,
  createFieldNameMapper,
} from "@eshg/lib-portal";

import { FlexLabel } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FlexLabel";
import { BOOLEAN_SELECT_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/styles";

import { TEXT_INPUT_STYLE } from "./AnamnesisForm";

export function FamilyHistoryInfoForm() {
  const familyHistoryInfo = createFieldNameMapper("familyHistoryInfo");

  return (
    <Stack gap={2} role="group" aria-labelledby="familienvorgeschichten-label">
      <Typography
        level="title-sm"
        component="h2"
        id="familienvorgeschichten-label"
      >
        Familienvorgeschichten
      </Typography>
      <Stack direction="row" gap={2} flexWrap="wrap">
        <BooleanSelectField
          name={familyHistoryInfo("spectaclesInFamily")}
          label={<FlexLabel>Brillen- bzw. Kontaktlinsenträger</FlexLabel>}
          component={HorizontalField}
          sx={BOOLEAN_SELECT_STYLE}
          allowDeselection
        />
        <InputField
          name={familyHistoryInfo("chronicIllnessOrDisabilityInFamily")}
          label={<FlexLabel>Chron. Erkrankungen bzw. Behinderungen</FlexLabel>}
          type="text"
          component={HorizontalField}
          sx={TEXT_INPUT_STYLE}
        />
      </Stack>
    </Stack>
  );
}
