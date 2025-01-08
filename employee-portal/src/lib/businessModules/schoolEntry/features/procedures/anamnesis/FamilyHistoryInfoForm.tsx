/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { BooleanSelectField } from "@eshg/lib-portal/components/formFields/BooleanSelectField";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Stack, Typography } from "@mui/joy";

import { FlexLabel } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FlexLabel";
import { BOOLEAN_SELECT_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/styles";

import { TEXT_INPUT_STYLE } from "./AnamnesisForm";

export function FamilyHistoryInfoForm() {
  const familyHistoryInfo = createFieldNameMapper("familyHistoryInfo");

  return (
    <Stack gap={2}>
      <Typography level="title-sm">Familienvorgeschichten</Typography>
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
