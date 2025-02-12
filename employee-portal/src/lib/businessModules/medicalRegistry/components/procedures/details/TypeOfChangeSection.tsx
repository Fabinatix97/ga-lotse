/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { changeTypeNames } from "@eshg/lib-portal/businessModules/medicalRegistry/constants";
import { ApiGetProcedureDraftResponse } from "@eshg/medical-registry-api";
import { Typography } from "@mui/joy";

import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";

export function TypeOfChangeSection({
  procedure,
}: Readonly<{ procedure: ApiGetProcedureDraftResponse }>) {
  return (
    <ContentPanel>
      <DetailsSection
        data-testid="type-of-change-section"
        title="Art der Änderung"
      >
        <Typography level="body-md">
          {changeTypeNames[procedure.typeOfChange]}
        </Typography>
      </DetailsSection>
    </ContentPanel>
  );
}
