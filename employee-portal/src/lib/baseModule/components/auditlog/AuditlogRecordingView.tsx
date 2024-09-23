/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { GradingTwoTone, KeyOffOutlined } from "@mui/icons-material";
import { Button, Sheet, Stack, Typography } from "@mui/joy";

import { useDeleteEmployeeUserKeys } from "@/lib/baseModule/api/mutations/users";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

export function AuditlogRecordingView() {
  return (
    <>
      <ButtonBar left={<FilterButton />} right={<DeletePasswordButton />} />
      <Sheet
        data-testid={"auditlogSheet"}
        sx={{
          pb: 8,
          mt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          border: "none",
        }}
      >
        <Stack alignItems={"center"} gap={2}>
          <GradingTwoTone fontSize={"xl4"} />
          <Typography>Audit Logs werden aufgezeichnet</Typography>
        </Stack>
      </Sheet>
    </>
  );
}

function DeletePasswordButton() {
  const { openConfirmationDialog } = useConfirmationDialog();
  const deleteEmployeeUserKeys = useDeleteEmployeeUserKeys();

  async function handleConfirm() {
    await deleteEmployeeUserKeys.mutateAsync().catch();
  }

  return (
    <Button
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
      startDecorator={<KeyOffOutlined />}
    >
      Passwort löschen
    </Button>
  );
}
