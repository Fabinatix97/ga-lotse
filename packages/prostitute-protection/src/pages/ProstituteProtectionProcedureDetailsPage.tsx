/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid, Stack } from "@mui/joy";

import { DisabledFormProvider, DynamicPageProps } from "@eshg/lib-portal";

import { useGetProcedure } from "../api/queries/procedures";
import { AppointmentDetails } from "../components/procedures/details/AppointmentDetails";
import { FinalProcedureActionPanel } from "../components/procedures/details/FinalProcedureActionPanel";
import { PersonDetails } from "../components/procedures/details/PersonDetails";
import { ProcedureDetails } from "../components/procedures/details/ProcedureDetails";
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
            <ProcedureDetails procedure={procedure} />
          </Stack>
        </Grid>
        <Grid xxs={12} lg={4}>
          <Stack spacing={2}>
            <AppointmentDetails procedure={procedure} />
            <FinalProcedureActionPanel procedure={procedure} />
          </Stack>
        </Grid>
      </Grid>
    </DisabledFormProvider>
  );
}
