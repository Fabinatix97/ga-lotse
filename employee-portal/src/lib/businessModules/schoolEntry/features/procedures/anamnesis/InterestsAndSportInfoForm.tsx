/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";

import { BooleanSelectField } from "@eshg/lib-portal/components/formFields/BooleanSelectField";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";

import { BOOLEAN_SELECT_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/styles";

export function InterestAndSportsInfoForm() {
  const interestAndSportsInfo = createFieldNameMapper("interestsAndSportsInfo");

  return (
    <Stack gap={2}>
      <Typography level="title-sm">
        Persönliche Besonderheiten / Interessen
      </Typography>
      <Stack direction="row" gap={2} flexWrap="wrap">
        <BooleanSelectField
          name={interestAndSportsInfo("canSwim")}
          label="Schwimmen"
          component={HorizontalField}
          sx={BOOLEAN_SELECT_STYLE}
          allowDeselection
        />
        <BooleanSelectField
          name={interestAndSportsInfo("hasSeahorseBadge")}
          label="Seepferdchenabzeichen"
          component={HorizontalField}
          sx={BOOLEAN_SELECT_STYLE}
          allowDeselection
        />
        <InputField
          name={interestAndSportsInfo("clubSport")}
          label="Sport im Verein"
          type="text"
          component={HorizontalField}
        />
        <InputField
          name={interestAndSportsInfo("otherInterests")}
          label="Sonstiges"
          type="text"
          component={HorizontalField}
        />
        <BooleanSelectField
          name="personalConspicuities"
          label="Persönliche Besonderheiten"
          component={HorizontalField}
          sx={BOOLEAN_SELECT_STYLE}
          allowDeselection
        />
      </Stack>
    </Stack>
  );
}
