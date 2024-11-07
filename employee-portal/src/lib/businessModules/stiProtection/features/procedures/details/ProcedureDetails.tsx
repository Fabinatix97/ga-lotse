/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid, Stack } from "@mui/joy";

import { useStiProcedureQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";

import { AdditionalDataSection } from "./AdditionalDataSection";
import { AnonIdentityDocumentCard } from "./AnonIdentityDocumentCard";
import { CloseAndReopenProcedurePanel } from "./CloseProcedurePanel";
import { PersonDetails } from "./PersonDetails";

export function ProcedureDetails({
  procedureId,
}: Readonly<{ procedureId: string }>) {
  const procedure = useStiProcedureQuery(procedureId).data;

  return (
    <Grid container spacing={2}>
      <Grid container spacing={2} xs={12} lg={8}>
        <Grid xs={12}>
          <PersonDetails procedure={procedure} />
        </Grid>
        <Grid xs={12}>
          <AnonIdentityDocumentCard />
        </Grid>
      </Grid>
      <Grid xs={12} lg={4}>
        <Stack spacing={2}>
          <AdditionalDataSection procedure={procedure} />
          <CloseAndReopenProcedurePanel procedure={procedure} />
        </Stack>
      </Grid>
    </Grid>
  );
}
