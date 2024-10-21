/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem } from "@mui/joy";
import { useRouter } from "next/navigation";
import { isDefined } from "remeda";

import { useDeleteReport } from "@/lib/businessModules/statistics/api/mutations/useDeleteReport";
import { useDeleteReportSeries } from "@/lib/businessModules/statistics/api/mutations/useDeleteReportSeries";
import {
  ConfirmationDialogOptions,
  useConfirmationDialog,
} from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

export function useDeleteWithConfirmation({
  redirectRoute,
}: {
  redirectRoute?: string;
} = {}) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const router = useRouter();
  const deleteReportSeries = useDeleteReportSeries();
  const deleteReport = useDeleteReport({
    onSuccess: () => {
      if (isDefined(redirectRoute)) {
        router.push(redirectRoute);
      }
    },
  });

  const sharedDialogProps: Omit<ConfirmationDialogOptions, "onConfirm"> = {
    color: "danger",
    description: "Wenn Sie mit dem Löschen fortfahren, wird ...",
    cancelLabel: "Abbrechen",
    confirmLabel: "Löschen",
  };

  function deleteReportSeriesWithConfirmation(seriesId: string) {
    openConfirmationDialog({
      ...sharedDialogProps,
      title: "Report-Serie löschen?",
      children: (
        <List marker="disc">
          <ListItem>die Report-Serie unwiderruflich gelöscht,</ListItem>
          <ListItem>alle Ausgaben der Serie werden gelöscht,</ListItem>
          <ListItem>die Report-Serie aus allen Abo-Listen entfernt,</ListItem>
          <ListItem>
            eine Nachricht an die Nutzer:innen mit Abo gesendet.
          </ListItem>
        </List>
      ),
      onConfirm: () => {
        deleteReportSeries(seriesId);
      },
    });
  }

  function deleteReportWithConfirmation(reportId: string) {
    openConfirmationDialog({
      ...sharedDialogProps,
      title: "Report löschen?",
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
      onConfirm: () => {
        deleteReport(reportId);
      },
    });
  }

  return { deleteReportSeriesWithConfirmation, deleteReportWithConfirmation };
}
