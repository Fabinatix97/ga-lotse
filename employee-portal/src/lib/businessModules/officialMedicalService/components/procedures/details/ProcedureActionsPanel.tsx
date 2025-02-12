/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  ApiEmployeeOmsProcedureDetails,
  ApiProcedureStatus,
} from "@eshg/official-medical-service-api";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import {
  useAbortDraftProcedure,
  useAcceptDraftProcedure,
  useCloseOpenProcedure,
} from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

export function ProcedureActionsPanel(
  props: Readonly<{
    procedure: ApiEmployeeOmsProcedureDetails;
    dataTestid: string;
  }>,
) {
  const router = useRouter();
  const { openConfirmationDialog } = useConfirmationDialog();
  const abortDraftProcedure = useAbortDraftProcedure();
  const acceptDraftProcedure = useAcceptDraftProcedure();
  const closeOpenProcedure = useCloseOpenProcedure();
  const snackbar = useSnackbar();

  function handleAcceptDraftProcedure() {
    if (
      isDefined(props.procedure.facility) &&
      isDefined(props.procedure.concern)
    ) {
      openConfirmationDialog({
        onConfirm: async () => {
          await acceptDraftProcedure.mutateAsync({ id: props.procedure.id });
        },
        confirmLabel: "Anlegen",
        title: "Vorgang anlegen?",
        description: "Der Vorgang erhält den Status “Offen”.",
      });
    } else {
      snackbar.error("Vorgang enthält keinen Auftraggeber und/oder Anliegen.", {
        manualClose: false,
      });
    }
  }

  function handleAbortDraftProcedure() {
    openConfirmationDialog({
      title: "Vorgang verwerfen?",
      confirmLabel: "Verwerfen",
      color: "danger",
      description:
        "Alle eingegebenen Daten werden gelöscht. Die Aktion lässt sich nicht rückgängig machen.",
      onConfirm: async () => {
        await abortDraftProcedure
          .mutateAsync({ id: props.procedure.id })
          .then(() => {
            router.push(routes.procedures.index);
          });
      },
    });
  }

  function handleCloseProcedure() {
    // ToDO: open confirmationDialog only if all appointments are closed (or cancelled?)
    // ToDO: add modal showing unresolved appointments, replaces openConfirmationDialog in case of unresolved appointments
    openConfirmationDialog({
      title: "Vorgang abschließen?",
      confirmLabel: "Abschließen",
      description: "Nach Abschluss können keine Daten mehr geändert werden.",
      onConfirm: async () => {
        await closeOpenProcedure.mutateAsync({ id: props.procedure.id });
      },
    });
  }

  const buttons: ReactNode[] = [];

  if (props.procedure.status === ApiProcedureStatus.Draft) {
    buttons.push(
      <Button
        key="abortProcedure"
        fullWidth
        color="danger"
        variant="soft"
        onClick={handleAbortDraftProcedure}
      >
        Vorgang verwerfen
      </Button>,
      <Button
        key="startProcedure"
        color="primary"
        onClick={handleAcceptDraftProcedure}
        fullWidth
      >
        Vorgang anlegen
      </Button>,
    );
  }

  if (props.procedure.status === ApiProcedureStatus.Open) {
    buttons.push(
      <Button
        key="closeProcedure"
        color="primary"
        onClick={handleCloseProcedure}
        fullWidth
      >
        Vorgang abschließen
      </Button>,
    );
  }
  if (buttons.length === 0) {
    return null;
  }

  return (
    <InformationSheet dataTestId={props.dataTestid}>{buttons}</InformationSheet>
  );
}
