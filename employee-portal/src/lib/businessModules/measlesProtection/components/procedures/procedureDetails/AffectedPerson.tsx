/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { SxProps } from "@mui/joy/styles/types";

import { CentralFilePersonDetails } from "@eshg/lib-employee-portal";
import {
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
} from "@eshg/measles-protection-api";

import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

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
    <InfoTile title={title} name="affectedPerson">
      <CentralFilePersonDetails
        person={{
          ...person,
          contactAddress: person.address,
        }}
        columnSx={COLUMN_STYLE}
      />
    </InfoTile>
  );
}
