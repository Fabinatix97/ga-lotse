/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
} from "@eshg/measles-protection-api";
import { Sheet } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { CentralFilePersonDetails } from "@/lib/shared/components/centralFile/display/CentralFilePersonDetails";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";

const COLUMN_STYLE: SxProps = {
  flexGrow: 1,
  maxWidth: (theme) => ({ md: `calc(100%/3 - 2 * ${theme.spacing(2)})` }),
};

export function AffectedPerson({
  procedure,
}: Readonly<{
  procedure: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure;
}>) {
  const title = "Betroffene Person";
  const person = procedure.affectedPerson;

  return (
    <Sheet>
      <DetailsSection title={title}>
        <CentralFilePersonDetails
          person={{
            ...person,
            contactAddress: person.address,
          }}
          columnSx={COLUMN_STYLE}
        />
      </DetailsSection>
    </Sheet>
  );
}
