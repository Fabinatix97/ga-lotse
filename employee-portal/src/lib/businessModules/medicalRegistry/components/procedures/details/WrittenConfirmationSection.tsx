/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetProcedure200Response } from "@eshg/employee-portal-api/medicalRegistry";
import { Typography } from "@mui/joy";

import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";

export function WrittenConfirmationSection({
  procedure,
}: Readonly<{ procedure: ApiGetProcedure200Response }>) {
  const message = procedure.requestForWrittenConfirmation
    ? "Der/Die Antragsteller:in hat eine schriftliche Meldebestätigung angefordert."
    : "Der/Die Antragsteller:in hat keine schriftliche Meldebestätigung angefordert.";

  return (
    <ContentPanel>
      <DetailsSection name="written-confirmation" title="Meldebestätigung">
        <Typography level="body-md">{message}</Typography>
      </DetailsSection>
    </ContentPanel>
  );
}
