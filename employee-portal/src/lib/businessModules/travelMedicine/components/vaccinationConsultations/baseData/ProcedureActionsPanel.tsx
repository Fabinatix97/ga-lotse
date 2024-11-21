/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetVaccinationConsultationDetailsResponse,
  ApiProcedureStatus,
  ApiServiceStatus,
  ApiTravelMedicineFeature,
} from "@eshg/employee-portal-api/travelMedicine";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Button, Grid } from "@mui/joy";
import { ReactNode } from "react";

import { useSearchReferencePersonsQuery } from "@/lib/baseModule/api/queries/persons";
import {
  UsePatchStatusRequest,
  useAcceptDraftVaccinationConsultation,
  usePatchStatus,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/travelMedicine/api/queries/featureToggles";
import { AbortProcedureModal } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/AbortProcedureModal";
import { useAcceptProcedureSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/AcceptProcedureSidebar";
import { OpenModalButton } from "@/lib/shared/components/buttons/OpenModalButton";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

export function ProcedureActionsPanel(
  props: Readonly<{
    procedure: ApiGetVaccinationConsultationDetailsResponse;
    dataTestid: string;
  }>,
) {
  const citizenPortalProcedureEnabled = useIsNewFeatureEnabled(
    ApiTravelMedicineFeature.CitizenPortalProcedure,
  );
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
      <Button key="closeProcedure" onClick={handleCloseProcedure} fullWidth>
        Vorgang schließen
      </Button>,
    );
  }

  if (props.procedure.status === ApiProcedureStatus.Closed) {
    buttons.push(
      <Button
        key="reopenProcedure"
        color="danger"
        onClick={handleReopenProcedure}
        fullWidth
      >
        Vorgang wiedereröffnen
      </Button>,
    );
  }

  if (
    citizenPortalProcedureEnabled &&
    props.procedure.status === ApiProcedureStatus.Draft
  ) {
    buttons.push(
      <Grid container spacing={2}>
        <Grid xs={6} display={"flex"}>
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
        <Grid xs={6} display={"flex"}>
          <Button
            key="startProcedure"
            color="primary"
            onClick={async () => {
              if (query.isSuccess && query.data.persons.length > 0) {
                acceptProcedureSidebar.open({
                  procedure: props.procedure,
                  queryResults: query.isSuccess
                    ? query.data.persons
                    : undefined,
                });
              } else if (query.isSuccess && query.data.persons.length === 0) {
                await handleCreate(props.procedure.procedureId);
              }
            }}
            fullWidth
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
