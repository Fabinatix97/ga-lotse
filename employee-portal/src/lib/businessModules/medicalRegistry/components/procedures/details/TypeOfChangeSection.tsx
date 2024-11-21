/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetProcedureDraftResponse } from "@eshg/employee-portal-api/medicalRegistry";
import { Typography } from "@mui/joy";

import { changeTypeNames } from "@/lib/businessModules/medicalRegistry/shared/constants";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";

export function TypeOfChangeSection({
  procedure,
}: Readonly<{ procedure: ApiGetProcedureDraftResponse }>) {
  return (
    <ContentPanel>
      <DetailsSection name="type-of-change-section" title="Art der Änderung">
        <Typography level="body-md">
          {changeTypeNames[procedure.typeOfChange]}
        </Typography>
      </DetailsSection>
    </ContentPanel>
  );
}
