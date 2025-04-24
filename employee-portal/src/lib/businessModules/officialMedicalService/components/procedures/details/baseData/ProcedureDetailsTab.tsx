/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiDataOrigin } from "@eshg/base-api";
import { WarningAmberOutlined } from "@mui/icons-material";
import { Alert, Grid, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  useGetAllDocuments,
  useGetProcedureDetails,
} from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import { AdditionalInfoPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/AdditionalInfoPanel";
import { AffectedPersonPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/AffectedPersonPanel";
import { AppointmentsPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/AppointmentsPanel";
import { FacilityPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/FacilityPanel";
import { MedicalOpinionStatusPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/MedicalOpinionStatusPanel";
import { ProcedureActionsPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/ProcedureActionsPanel";
import { WaitingRoomPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/WaitingRoomPanel";
import { DetailsGrid } from "@/lib/businessModules/officialMedicalService/shared/DetailsGrid";
import { isProcedureOpenOrInProgress } from "@/lib/businessModules/officialMedicalService/shared/helpers";

const SPACING = { xxs: 2, sm: 3, md: 3, xxl: 3 };

interface ProcedureDetailsTabProps {
  procedureId: string;
}

export function ProcedureDetailsTab({
  procedureId,
}: Readonly<ProcedureDetailsTabProps>) {
  const [{ data: procedure }, { data: documents }] = useSuspenseQueries({
    queries: [
      useGetProcedureDetails(procedureId),
      useGetAllDocuments(procedureId),
    ],
  });

  return (
    <DetailsGrid data-testid="procedure-detail-page">
      <Grid xs={9}>
        <Stack spacing={SPACING}>
          {procedure.affectedPerson.dataOrigin === ApiDataOrigin.External && (
            <Alert color={"warning"} startDecorator={<WarningAmberOutlined />}>
              Der Entwurf kommt aus einer externen Quelle. Sie müssen die
              Personendaten prüfen, bevor Sie den Vorgang anlegen können.
            </Alert>
          )}
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
            documents={documents}
            dataTestid="procedure-actions"
          />
        </Stack>
      </Grid>
    </DetailsGrid>
  );
}
