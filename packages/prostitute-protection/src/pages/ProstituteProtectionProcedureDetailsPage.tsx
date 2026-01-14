/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid, Stack } from "@mui/joy";

import { DisabledFormProvider, DynamicPageProps } from "@eshg/lib-portal";

import { useGetProcedure } from "../api/queries/procedures";
import { AdditionalDataSection } from "../components/procedures/details/AdditionalDataSection";
import { CertificateActionPanel } from "../components/procedures/details/CertificateActionPanel";
import { FinalProcedureActionPanel } from "../components/procedures/details/FinalProcedureActionPanel";
import { PersonDetails } from "../components/procedures/details/PersonDetails";
import { RelatedProceduresTable } from "../components/procedures/details/RelatedProceduresTable";
import { WaitingRoomPanel } from "../components/procedures/details/WaitingRoomPanel";
import { ProstituteProtectionProcedureRouteParams } from "../schemas/ProstituteProtectionProcedureRouteParams";
import { isProcedureFinalized } from "../shared/helpers";
import { useProcedureRouteParams } from "../shared/hooks/useProcedureRouteParams";

export function ProstituteProtectionProcedureDetailsPage(
  props: DynamicPageProps<ProstituteProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = useProcedureRouteParams(props.params);
  const { data: procedure } = useGetProcedure(procedureId);

  return (
    <DisabledFormProvider disabled={isProcedureFinalized(procedure)}>
      <Grid container spacing={2}>
        <Grid xxs={12} lg={8}>
          <Stack spacing={2}>
            <PersonDetails procedure={procedure} />
            <RelatedProceduresTable procedureId={procedure.id} />
          </Stack>
        </Grid>
        <Grid xxs={12} lg={4}>
          <Stack spacing={2}>
            <AdditionalDataSection procedure={procedure} />
            <WaitingRoomPanel procedure={procedure} />
            <CertificateActionPanel procedure={procedure} />
            <FinalProcedureActionPanel procedure={procedure} />
          </Stack>
        </Grid>
      </Grid>
    </DisabledFormProvider>
  );
}
