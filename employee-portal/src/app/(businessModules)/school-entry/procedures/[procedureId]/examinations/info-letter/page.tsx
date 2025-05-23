/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Sheet } from "@mui/joy";

import { ContentPanel, ContentPanelTitle } from "@eshg/lib-employee-portal";
import { ApiSchoolEntryFeature } from "@eshg/school-entry-api";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/schoolEntry/api/queries/featureTogglesApi";

export default function SchoolEntryInfoLetterPage() {
  const isSchoolInfoLetterEnabled = useIsNewFeatureEnabled(
    ApiSchoolEntryFeature.EditableSchoolInfoLetter,
  );

  if (!isSchoolInfoLetterEnabled) {
    throw Error();
  }

  return (
    <ContentPanel>
      <ContentPanelTitle>Schulinfobrief Konfigurator</ContentPanelTitle>
      <Sheet
        sx={{
          borderRadius: "24px",
          padding: "175px",
        }}
      >
        todo
      </Sheet>
    </ContentPanel>
  );
}
