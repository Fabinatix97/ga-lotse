/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";
import { FormikProps } from "formik";

import { ConfirmationDialogOptions } from "@eshg/lib-portal";

import { SchoolInfoLetter } from "@/lib/businessModules/schoolEntry/api/models/SchoolInfoLetter";

export function LeaveDirtyConfirmationDialogProps(
  handleSubmit: FormikProps<SchoolInfoLetter>["submitForm"],
  onNavigate: () => void,
): ConfirmationDialogOptions {
  return {
    title: "Änderungen speichern?",
    color: "primary",
    description:
      "Möchten Sie ohne speichern zur Untersuchung zurückkehren? Alle Änderungen gehen verloren.",
    buttonBarComponent: ({ handleCancel, onConfirm, onDeny, onClose }) => {
      return (
        <Stack direction="row" justifyContent="space-between">
          <Button variant="outlined" color="neutral" onClick={handleCancel}>
            Schließen
          </Button>
          <Stack direction="row" gap={2}>
            <Button
              variant="plain"
              color="danger"
              onClick={async () => {
                await onDeny!();
                onClose();
              }}
            >
              Ohne speichern fortfahren
            </Button>
            <Button
              onClick={async () => {
                await onConfirm();
                onClose();
              }}
            >
              Speichern und weiter
            </Button>
          </Stack>
        </Stack>
      );
    },
    onConfirm: async () => {
      await handleSubmit();
      onNavigate();
    },
    onDeny: onNavigate,
  };
}
