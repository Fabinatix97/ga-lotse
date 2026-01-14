/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Grid } from "@mui/joy";
import { ReactNode } from "react";

import {
  InformationSheet,
  OpenModalButton,
  useSearchReferencePersonsQuery,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal";
import {
  ApiGetVaccinationConsultationDetailsResponse,
  ApiProcedureStatus,
  ApiServiceStatus,
} from "@eshg/travel-medicine-api";

import {
  UsePatchStatusRequest,
  useAcceptDraftVaccinationConsultation,
  usePatchStatus,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { AbortProcedureModal } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/AbortProcedureModal";
import { useAcceptProcedureSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/AcceptProcedureSidebar";

export function ProcedureActionsPanel(
  props: Readonly<{
    procedure: ApiGetVaccinationConsultationDetailsResponse;
    dataTestid: string;
  }>,
) {
  const snackbar = useSnackbar();

  const patchStatus = usePatchStatus();
  const acceptProcedureSidebar = useAcceptProcedureSidebar();
  const acceptDraftVaccinationConsultation =
    useAcceptDraftVaccinationConsultation();

  function procedureHasPlannedServices() {
    return props.procedure.servicePlanGroups.some((g) =>
      g.servicePlanEntries.some((s) => s.status === ApiServiceStatus.Planned),
    );
  }
  async function handleCloseProcedure() {
    if (procedureHasPlannedServices()) {
      snackbar.error(
        "Es befinden sich noch geplante Leistungen im Vorgang, diese müssen zunächst durchgeführt oder aus dem Termin entfernt werden, um den Vorgang schließen zu können.",
      );
    } else {
      const request: UsePatchStatusRequest = {
        procedureId: props.procedure.procedureId,
        apiProcedureStatus: ApiProcedureStatus.Closed,
      };
      await patchStatus.mutateAsync(request);
    }
  }

  async function handleReopenProcedure() {
    const request: UsePatchStatusRequest = {
      procedureId: props.procedure.procedureId,
      apiProcedureStatus: ApiProcedureStatus.Open,
    };
    await patchStatus.mutateAsync(request);
  }

  async function handleCreate(procedureId: string) {
    const request = {
      procedureId: procedureId,
      apiPatchAcceptDraftRequest: {
        referencePersonId: undefined,
      },
    };
    await acceptDraftVaccinationConsultation.mutateAsync(request);
  }

  const query = useSearchReferencePersonsQuery(
    {
      firstName: props.procedure.patient.firstName.trim(),
      lastName: props.procedure.patient.lastName.trim(),
      dateOfBirth: new Date(props.procedure.patient.dateOfBirth),
    },
    {
      enabled: true,
    },
  );

  const buttons: ReactNode[] = [];

  if (props.procedure.status === ApiProcedureStatus.Open) {
    buttons.push(
      <Button key="closeProcedure" fullWidth onClick={handleCloseProcedure}>
        Vorgang schließen
      </Button>,
    );
  }

  if (props.procedure.status === ApiProcedureStatus.Closed) {
    buttons.push(
      <Button
        key="reopenProcedure"
        color="danger"
        fullWidth
        onClick={handleReopenProcedure}
      >
        Vorgang wiedereröffnen
      </Button>,
    );
  }

  if (props.procedure.status === ApiProcedureStatus.Draft) {
    buttons.push(
      <Grid container spacing={2}>
        <Grid xs={6} display="flex">
          <OpenModalButton
            key="reopenProcedure"
            renderModal={(modalProps) => (
              <AbortProcedureModal
                procedure={props.procedure}
                {...modalProps}
              />
            )}
            fullWidth
            color="neutral"
            variant="soft"
          >
            Vorgang abbrechen
          </OpenModalButton>
        </Grid>
        <Grid xs={6} display="flex">
          <Button
            key="startProcedure"
            sx={{ visibility: query.isSuccess ? "visible" : "hidden" }}
            color="primary"
            fullWidth
            onClick={async () => {
              if (query.isSuccess && query.data.persons.length > 0) {
                acceptProcedureSidebar.open({
                  procedure: props.procedure,
                  queryResults: query.data.persons,
                });
              } else if (query.isSuccess && query.data.persons.length === 0) {
                await handleCreate(props.procedure.procedureId);
              }
            }}
          >
            Vorgang starten
          </Button>
        </Grid>
      </Grid>,
    );
  }

  if (buttons.length === 0) {
    return null;
  }

  return (
    <InformationSheet dataTestId={props.dataTestid}>{buttons}</InformationSheet>
  );
}
