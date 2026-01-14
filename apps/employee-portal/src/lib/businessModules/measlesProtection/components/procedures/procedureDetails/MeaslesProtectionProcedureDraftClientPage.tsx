/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid, Stack } from "@mui/joy";
import { useRouter } from "next/navigation";

import { ToolbarBackButton } from "@eshg/lib-employee-portal";
import { formatDate, useSnackbar } from "@eshg/lib-portal";
import { ApiDraftMeaslesProcedure } from "@eshg/measles-protection-api";

import { useSubmitDraftProcedureMutation } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { useProcedureQuery } from "@/lib/businessModules/measlesProtection/api/queries/procedures";
import { NewCustodianButton } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/NewCustodianButton";
import { UnderagedPersonAlert } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/UnderagedPersonAlert";
import { MeaslesProtectionLayout } from "@/lib/businessModules/measlesProtection/layout/MeaslesProtectionLayout";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";

import { AffectedPerson } from "./AffectedPerson";
import { Custodians } from "./Custodians";
import { Facility } from "./Facility";
import { NewFacilityButton } from "./NewFacilityButton";
import { UpdateProcedureSection } from "./UpdateProcedureSection";
import { ValidUpdateProcedureForm } from "./helpers";

export function MeaslesProtectionProcedureDraftClientPage({
  id,
}: {
  id: string;
}) {
  const procedure = useProcedureQuery(id).data;
  const router = useRouter();
  const snackbar = useSnackbar();

  const submitProcedure = useSubmitDraftProcedureMutation({
    onSuccess: (result) => {
      if (!result) {
        return;
      }
      router.push(routes.procedures.details(procedure.id).index);
      snackbar.confirmation("Vorgang wurde erfolgreich angelegt.");
    },
  });

  function handleSubmit(data: ValidUpdateProcedureForm) {
    return submitProcedure.mutate({ id: procedure.id, data });
  }

  const title = `${procedure.affectedPerson.lastName}, ${procedure.affectedPerson.firstName}, ${formatDate(procedure.affectedPerson.dateOfBirth)}`;
  return (
    <MeaslesProtectionLayout
      title={title}
      backButton={<ToolbarBackButton href={routes.procedures.index} />}
    >
      <Grid container gap={3} data-testid="procedureDraftPage">
        <Grid xs={12} lg>
          <Stack gap={3}>
            <UnderagedPersonAlert procedure={procedure} />
            <AffectedPerson procedure={procedure} />
            <Custodians procedure={procedure} />
            {procedure.facility && <Facility procedure={procedure} />}
            <AddButtons procedure={procedure} />
          </Stack>
        </Grid>
        <Grid xs={12} lg={4} sx={{ maxWidth: { lg: 432 } }}>
          <UpdateProcedureSection
            procedure={procedure}
            openProcedure={handleSubmit}
          />
        </Grid>
      </Grid>
    </MeaslesProtectionLayout>
  );
}

function AddButtons({ procedure }: { procedure: ApiDraftMeaslesProcedure }) {
  return (
    <Grid container spacing={3}>
      <Grid xs={6}>
        <NewCustodianButton procedureId={procedure.id} />
      </Grid>
      {!procedure.facility && (
        <Grid xs={6}>
          <NewFacilityButton procedureId={procedure.id} />
        </Grid>
      )}
    </Grid>
  );
}
