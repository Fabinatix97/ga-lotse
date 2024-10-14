/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiProcedureStatus,
  ApiServiceStatus,
} from "@eshg/employee-portal-api/travelMedicine";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Button, Stack } from "@mui/joy";
import { Dispatch, SetStateAction } from "react";

import {
  UsePatchStatusRequest,
  usePatchStatus,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { CreateProcedureValues } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

export function CloseProcedurePanel(
  props: Readonly<{
    procedure: CreateProcedureValues;
    dataTestid: string;
    setIsProcedureClosed: Dispatch<SetStateAction<boolean>>;
  }>,
) {
  const snackbar = useSnackbar();
  const patchStatus = usePatchStatus();

  function procedureHasPlannedServices() {
    return props.procedure.services.some(
      (s) => s.status === ApiServiceStatus.Planned,
    );
  }
  async function handleCloseProcedure() {
    if (procedureHasPlannedServices()) {
      snackbar.error(
        "Es befinden sich noch geplante Leistungen im Vorgang, diese müssen zunächst durchgeführt oder aus dem Termin entfernt werden, um den Vorgang schließen zu können.",
      );
    } else {
      const request: UsePatchStatusRequest = {
        procedureId: props.procedure.externalId,
        apiProcedureStatus: ApiProcedureStatus.Closed,
      };
      await patchStatus
        .mutateAsync(request)
        .then(() => props.setIsProcedureClosed(true));
    }
  }

  async function handleReopenProcedure() {
    const request: UsePatchStatusRequest = {
      procedureId: props.procedure.externalId,
      apiProcedureStatus: ApiProcedureStatus.Open,
    };
    await patchStatus
      .mutateAsync(request)
      .then(() => props.setIsProcedureClosed(false));
  }

  return (
    <InformationSheet>
      {props.procedure.status === ApiProcedureStatus.Closed ? (
        <Button
          color="danger"
          onClick={handleReopenProcedure}
          fullWidth
          data-testid={props.dataTestid}
        >
          Vorgang wiedereröffnen
        </Button>
      ) : (
        <Stack direction={{ xxs: "column", md: "row" }} gap={2}>
          <Button
            onClick={handleCloseProcedure}
            fullWidth
            data-testid={props.dataTestid}
          >
            Vorgang schließen
          </Button>
        </Stack>
      )}
    </InformationSheet>
  );
}
