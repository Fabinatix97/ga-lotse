/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { KeyOffOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { useConfirmationDialog } from "@eshg/lib-employee-portal";

import { useDeleteEmployeeUserKeys } from "@/lib/baseModule/api/mutations/users";

export function AuditlogDeletePasswordButton() {
  const { openConfirmationDialog } = useConfirmationDialog();
  const deleteEmployeeUserKeys = useDeleteEmployeeUserKeys();

  async function handleConfirm() {
    await deleteEmployeeUserKeys.mutateAsync();
  }

  return (
    <Button
      startDecorator={<KeyOffOutlined />}
      onClick={() =>
        openConfirmationDialog({
          title: "Passwort endgültig löschen?",
          description:
            "Durch das Löschen Ihres Passworts verlieren Sie " +
            "endgültig den Zugriff auf alle bisher erzeugten Audit Logs. " +
            "Diese Aktion kann nicht rückgängig gemacht werden.",
          confirmLabel: "Passwort löschen",
          color: "danger",
          onConfirm: handleConfirm,
        })
      }
    >
      Passwort löschen
    </Button>
  );
}
