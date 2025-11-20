/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfirmationDialog } from "@eshg/lib-employee-portal";

import { ApiProstituteProtectionProcedure } from "../../../mock";

interface CloseAndReopenConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  procedure?: ApiProstituteProtectionProcedure;
}

export function CloseConfirmationDialog({
  open,
  onClose,
  onConfirm,
}: CloseAndReopenConfirmationDialogProps) {
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

export function CancelConfirmationDialog({
  open,
  onClose,
  onConfirm,
}: Omit<CloseAndReopenConfirmationDialogProps, "procedure">) {
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
