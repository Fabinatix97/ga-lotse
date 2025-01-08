/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiDraftMeaslesProcedure } from "@eshg/employee-portal-api/measlesProtection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Grid, Stack } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSubmitDraftProcedureMutation } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { useProcedureQuery } from "@/lib/businessModules/measlesProtection/api/queries/procedures";
import { NewCustodianButton } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/NewCustodianButton";
import { MeaslesProtectionLayout } from "@/lib/businessModules/measlesProtection/layout/MeaslesProtectionLayout";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";

import { AddCustodianSidebar } from "./AddCustodianSidebar";
import { AffectedPerson } from "./AffectedPerson";
import { Custodians } from "./Custodians";
import { EditAffectedPersonSidebar } from "./EditAffectedPersonSidebar";
import { EditCustodianSidebar } from "./EditCustodianSidebar";
import { EditFacilitySidebar } from "./EditFacilitySidebar";
import { Facility } from "./Facility";
import { NewFacilityButton } from "./NewFacilityButton";
import { NewFacilitySidebar } from "./NewFacilitySidebar";
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

  useEffect(() => {
    if (procedure.procedureStatus !== "DRAFT") {
      router.replace(routes.procedures.details(procedure.id).index);
    }
  }, [procedure.id, procedure.procedureStatus, router]);

  if (procedure.procedureStatus !== "DRAFT") {
    return null;
  }

  function handleSubmit(data: ValidUpdateProcedureForm) {
    return submitProcedure.mutate({ id: procedure.id, data });
  }

  const title = `${procedure.affectedPerson.lastName}, ${procedure.affectedPerson.firstName}, ${formatDate(procedure.affectedPerson.dateOfBirth)}`;
  return (
    <MeaslesProtectionLayout title={title} backHref={routes.procedures.index}>
      <Grid container gap={3} data-testid="procedureDraftPage">
        <Grid xs={12} lg>
          <Stack gap={3}>
            <AffectedPerson procedure={procedure} />
            <Custodians procedure={procedure} />
            <Facility procedure={procedure} />
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
      <AddCustodianSidebar procedure={procedure} />
      <EditCustodianSidebar custodians={procedure.custodians} />
      <EditFacilitySidebar facility={procedure.facility} />
      <EditAffectedPersonSidebar person={procedure.affectedPerson} />
      <NewFacilitySidebar procedure={procedure} />
    </MeaslesProtectionLayout>
  );
}

function AddButtons({ procedure }: { procedure: ApiDraftMeaslesProcedure }) {
  return (
    <Grid container spacing={3}>
      <Grid xs={6}>
        <NewCustodianButton />
      </Grid>
      {!procedure.facility && (
        <Grid xs={6}>
          <NewFacilityButton />
        </Grid>
      )}
    </Grid>
  );
}
