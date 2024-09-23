/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid, Stack } from "@mui/joy";

import { useStiProcedureQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";

import { AdditionalDataSection } from "./AdditionalDataSection";
import { CloseProcedurePanel } from "./CloseProcedurePanel";
import { PersonDetails } from "./PersonDetails";

const SPACING = { sm: 2, md: 3, xxl: 4 };

export function ProcedureDetails({
  procedureId,
}: Readonly<{ procedureId: string }>) {
  const procedure = useStiProcedureQuery(procedureId).data;

  return (
    <Grid container spacing={SPACING}>
      <Grid xs={8}>
        <PersonDetails procedure={procedure} />
      </Grid>
      <Grid xs={4}>
        <Stack spacing={SPACING}>
          <AdditionalDataSection procedure={procedure} />
          <CloseProcedurePanel />
        </Stack>
      </Grid>
    </Grid>
  );
}
