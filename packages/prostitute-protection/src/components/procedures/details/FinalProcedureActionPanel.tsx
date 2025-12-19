/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import {
  ConfirmationDialog,
  ContentPanel,
  OpenModalButton,
} from "@eshg/lib-employee-portal";
import { ApiProcedureDetails } from "@eshg/prostitute-protection-api";

import {
  useAbortProcedureMutation,
  useCloseProcedureMutation,
} from "../../../api/mutations/procedures";
import { isProcedureFinalized } from "../../../shared/helpers";

export function FinalProcedureActionPanel({
  procedure,
}: Readonly<{ procedure: ApiProcedureDetails }>) {
  const abortProcedure = useAbortProcedureMutation();
  const closeProcedure = useCloseProcedureMutation();

  if (isProcedureFinalized(procedure)) {
    return null;
  }

  const isCertificateCreated = isDefined(
    procedure.consultationCertificateCreatedAt,
  );

  async function handleCloseProcedure() {
    await closeProcedure.mutateAsync({
      procedureId: procedure.id,
      apiCloseProcedureRequest: {
        version: procedure.version,
      },
    });
  }

  async function handleAbortProcedure() {
    await abortProcedure.mutateAsync({
      procedureId: procedure.id,
      apiAbortProcedureRequest: {
        version: procedure.version,
      },
    });
  }

  return (
    <ContentPanel dense>
      {isCertificateCreated ? (
        <OpenModalButton
          key="closeProcedure"
          renderModal={(modalProps) => (
            <CloseConfirmationDialog
              {...modalProps}
              onConfirm={handleCloseProcedure}
            />
          )}
        >
          Vorgang abschließen
        </OpenModalButton>
      ) : (
        <OpenModalButton
          key="abortProcedure"
          renderModal={(modalProps) => (
            <AbortConfirmationDialog
              {...modalProps}
              onConfirm={handleAbortProcedure}
            />
          )}
          color="danger"
          variant="soft"
        >
          Vorgang abbrechen
        </OpenModalButton>
      )}
    </ContentPanel>
  );
}

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  procedure?: ApiProcedureDetails;
}

export function CloseConfirmationDialog({
  open,
  onClose,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <ConfirmationDialog
      title="Vorgang abschließen?"
      description="Möchten Sie diesen Vorgang wirklich abschließen?"
      confirmLabel="Abschließen"
      color="primary"
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

export function AbortConfirmationDialog({
  open,
  onClose,
  onConfirm,
}: Omit<ConfirmationDialogProps, "procedure">) {
  return (
    <ConfirmationDialog
      title="Möchten Sie diesen Vorgang wirklich abbrechen?"
      description="Diese Aktion kann nicht rückgängig gemacht werden. Bitte informieren Sie ggf. den Antragsteller darüber, dass der Antrag abgebrochen wurde."
      confirmLabel="Vorgang abbrechen"
      color="danger"
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
