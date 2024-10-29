/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
} from "@eshg/employee-portal-api/measlesProtection";
import { SxProps } from "@mui/joy/styles/types";

import { CentralFilePersonDetails } from "@/lib/shared/components/centralFile/display/CentralFilePersonDetails";
import { DetailsCard } from "@/lib/shared/components/detailsCard/DetailsCard";

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
    <DetailsCard title={title}>
      <CentralFilePersonDetails
        person={{
          ...person,
          contactAddress: person.address,
        }}
        columnSx={COLUMN_STYLE}
      />
    </DetailsCard>
  );
}
