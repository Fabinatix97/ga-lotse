/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useGetProcedureDetails } from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import { AdditionalInfoPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/AdditionalInfoPanel";
import { AffectedPersonPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/AffectedPersonPanel";
import { AppointmentsPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/AppointmentsPanel";
import { DetailsGrid } from "@/lib/businessModules/officialMedicalService/components/procedures/details/DetailsGrid";
import { FacilityPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/FacilityPanel";
import { MedicalOpinionStatusPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/MedicalOpinionStatusPanel";
import { ProcedureActionsPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/ProcedureActionsPanel";
import { WaitingRoomPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/WaitingRoomPanel";
import { isProcedureOpenOrInProgress } from "@/lib/businessModules/officialMedicalService/shared/helpers";

const SPACING = { xxs: 2, sm: 3, md: 3, xxl: 3 };

interface ProcedureDetailsTabProps {
  procedureId: string;
}

export function ProcedureDetailsTab({
  procedureId,
}: Readonly<ProcedureDetailsTabProps>) {
  const [{ data: procedure }] = useSuspenseQueries({
    queries: [useGetProcedureDetails(procedureId)],
  });

  return (
    <DetailsGrid data-testid="procedure-detail-page">
      <Grid xs={9}>
        <Stack spacing={SPACING}>
          <AffectedPersonPanel procedure={procedure} />
          <FacilityPanel procedure={procedure} />
          <AppointmentsPanel procedure={procedure} />
        </Stack>
      </Grid>
      <Grid xs={3}>
        <Stack spacing={SPACING}>
          <AdditionalInfoPanel procedure={procedure} />
          <MedicalOpinionStatusPanel procedure={procedure} />
          {isProcedureOpenOrInProgress(procedure) && (
            <WaitingRoomPanel procedure={procedure} />
          )}
          <ProcedureActionsPanel
            procedure={procedure}
            dataTestid="procedure-actions"
          />
        </Stack>
      </Grid>
    </DetailsGrid>
  );
}
