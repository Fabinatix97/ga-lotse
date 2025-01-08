/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid, Stack } from "@mui/joy";

import { useGetProcedureDetails } from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import { AffectedPersonPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/AffectedPersonPanel";
import { DetailsGrid } from "@/lib/businessModules/officialMedicalService/components/procedures/details/DetailsGrid";
import { FacilityPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/FacilityPanel";

const SPACING = { xxs: 2, sm: 3, md: 3, xxl: 3 };

interface ProcedureDetailsTabProps {
  procedureId: string;
}

export function ProcedureDetailsTab({
  procedureId,
}: Readonly<ProcedureDetailsTabProps>) {
  const { data: procedure } = useGetProcedureDetails(procedureId);

  return (
    <DetailsGrid data-testid="procedure-detail-page">
      <Grid xs={9}>
        <Stack spacing={SPACING}>
          <AffectedPersonPanel procedure={procedure} />
          <FacilityPanel procedure={procedure} />
        </Stack>
      </Grid>
      <Grid xs={3}>
        <Stack spacing={SPACING}>{/*todo sidepanel*/}</Stack>
      </Grid>
    </DetailsGrid>
  );
}
