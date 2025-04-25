/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import {
  InformationSheet,
  OpenModalButton,
  useConfirmationDialog,
  useSearchReferencePersonsQuery,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  ApiDocument,
  ApiEmployeeOmsProcedureDetails,
  ApiProcedureStatus,
} from "@eshg/official-medical-service-api";

import {
  useAbortDraftProcedure,
  useAcceptDraftProcedure,
} from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { CloseProcedureModal } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/CloseProcedureModal";
import { useMergeAffectedPersonSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/MergeAffectedPersonButton";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";

export function ProcedureActionsPanel(
  props: Readonly<{
    procedure: ApiEmployeeOmsProcedureDetails;
    documents: ApiDocument[];
    dataTestid: string;
  }>,
) {
  const router = useRouter();
  const { openConfirmationDialog } = useConfirmationDialog();
  const abortDraftProcedure = useAbortDraftProcedure();
  const acceptDraftProcedure = useAcceptDraftProcedure();
  const snackbar = useSnackbar();
  const mergeAffectedPersonSidebar = useMergeAffectedPersonSidebar();

  const searchReferencePersonsQuery = useSearchReferencePersonsQuery(
    {
      firstName: props.procedure.affectedPerson.firstName.trim(),
      lastName: props.procedure.affectedPerson.lastName.trim(),
      dateOfBirth: new Date(props.procedure.affectedPerson.dateOfBirth),
    },
    {
      enabled: props.procedure.status === ApiProcedureStatus.Draft,
    },
  );

  function handleAcceptDraftProcedure() {
    if (
      isDefined(props.procedure.facility) &&
      isDefined(props.procedure.concern)
    ) {
      openConfirmationDialog({
        onConfirm: async () => {
          await acceptDraftProcedure.mutateAsync({
            id: props.procedure.id,
            apiPatchAcceptDraftProcedureRequest: {
              affectedPerson: undefined,
              referencePersonId: undefined,
            },
          });
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
    );

    if (props.procedure.affectedPerson.dataOrigin !== "EXTERNAL") {
      buttons.push(
        <Button
          key="startProcedure"
          color="primary"
          onClick={handleAcceptDraftProcedure}
          fullWidth
        >
          Vorgang anlegen
        </Button>,
      );
    } else {
      buttons.push(
        <Button
          key="mergeAffectedPerson"
          color="primary"
          fullWidth
          onClick={() =>
            mergeAffectedPersonSidebar.open({
              procedure: props.procedure,
              searchReferencePersonsQuery: searchReferencePersonsQuery,
            })
          }
        >
          Personendaten prüfen
        </Button>,
      );
    }
  }

  if (props.procedure.status === ApiProcedureStatus.Open) {
    buttons.push(
      <OpenModalButton
        key="closeProcedure"
        renderModal={(modalProps) => (
          <CloseProcedureModal
            procedure={props.procedure}
            {...modalProps}
            allDocuments={props.documents}
          />
        )}
      >
        Vorgang abschließen
      </OpenModalButton>,
    );
  }
  if (buttons.length === 0) {
    return null;
  }

  return (
    <InformationSheet dataTestId={props.dataTestid}>{buttons}</InformationSheet>
  );
}
