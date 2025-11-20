/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid, Stack } from "@mui/joy";

import { DisabledFormProvider, DynamicPageProps } from "@eshg/lib-portal";

import { AdditionalDataSection } from "../components/procedures/details/AdditionalDataSection";
import { FinalProcedureActionPanel } from "../components/procedures/details/FinalProcedureActionPanel";
import { PersonDetails } from "../components/procedures/details/PersonDetails";
import { mockProcedures } from "../mock";
import { ProstituteProtectionProcedureRouteParams } from "../schemas/ProstituteProtectionProcedureRouteParams";
import { useProcedureRouteParams } from "../shared/hooks/useProcedureRouteParams";

export function ProstituteProtectionProcedureDetailsPage(
  props: DynamicPageProps<ProstituteProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = useProcedureRouteParams(props.params);
  // TODO: Replace this once the prostitute protection procedures are available
  const procedure =
    mockProcedures.find((p) => p.id === procedureId) ?? mockProcedures[0]!;

  return (
    <DisabledFormProvider disabled={Boolean(true)}>
      <Grid container spacing={2}>
        <Grid spacing={2} xxs={12} lg={8}>
          <Grid xxs={12} mb={2}>
            <PersonDetails procedure={procedure} />
          </Grid>
        </Grid>
        <Grid xxs={12} lg={4}>
          <Stack spacing={2}>
            <AdditionalDataSection procedure={procedure} />
            <FinalProcedureActionPanel procedure={procedure} />
          </Stack>
        </Grid>
      </Grid>
    </DisabledFormProvider>
  );
}
