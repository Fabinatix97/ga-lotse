/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem } from "@mui/joy";
import { useRouter } from "next/navigation";
import { isDefined } from "remeda";

import { useDeleteReport } from "@/lib/businessModules/statistics/api/mutations/useDeleteReport";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

export function useDeleteReportWithConfirmation({
  redirectRoute,
}: {
  redirectRoute?: string;
} = {}) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const router = useRouter();
  const deleteReport = useDeleteReport({
    onSuccess: () => {
      if (isDefined(redirectRoute)) {
        router.push(redirectRoute);
      }
    },
  });

  function deleteReportWithConfirmation(seriesId: string) {
    openConfirmationDialog({
      color: "danger",
      title: "Report löschen?",
      description: "Wenn Sie mit dem Löschen fortfahren, wird ...",
      children: (
        <List marker="disc">
          <ListItem>der Report unwiderruflich gelöscht,</ListItem>
          <ListItem>der Report aus allen Merklisten entfernt,</ListItem>
          <ListItem>
            eine Nachricht an die Nutzer:innen gesendet, die den Report in ihrer
            Merkliste haben.
          </ListItem>
        </List>
      ),
      cancelLabel: "Abbrechen",
      confirmLabel: "Löschen",
      onConfirm: () => {
        deleteReport(seriesId);
      },
    });
  }

  return deleteReportWithConfirmation;
}
