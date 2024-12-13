/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiEmployeeOmsProcedureDetails } from "@eshg/employee-portal-api/officialMedicalService";
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
  procedure: ApiEmployeeOmsProcedureDetails;
}>) {
  const title = "Betroffene Person";
  const person = procedure.affectedPerson;

  return (
    person && (
      <Sheet data-testid="affected-person">
        <DetailsSection title={title}>
          <CentralFilePersonDetails person={person} columnSx={COLUMN_STYLE} />
        </DetailsSection>
      </Sheet>
    )
  );
}
