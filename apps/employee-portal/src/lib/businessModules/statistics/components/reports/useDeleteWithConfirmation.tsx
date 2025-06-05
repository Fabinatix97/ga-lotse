/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem } from "@mui/joy";
import { useRouter } from "next/navigation";
import { isDefined } from "remeda";

import { useConfirmationDialog } from "@eshg/lib-employee-portal";
import { ConfirmationDialogOptions } from "@eshg/lib-portal";

import { useDeleteReport } from "@/lib/businessModules/statistics/api/mutations/useDeleteReport";
import { useDeleteReportSeries } from "@/lib/businessModules/statistics/api/mutations/useDeleteReportSeries";

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
    cancelLabel: "Abbrechen",
    confirmLabel: "Löschen",
  };

  function deleteReportSeriesWithConfirmation(seriesId: string) {
    openConfirmationDialog({
      ...sharedDialogProps,
      title: "Report-Serie löschen?",
      description: "Wenn Sie mit dem Löschen fortfahren, wird ...",
      children: (
        <List marker="disc">
          <ListItem>die Report-Serie unwiderruflich gelöscht,</ListItem>
          <ListItem>alle Ausgaben der Serie werden gelöscht.</ListItem>
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
      description:
        "Wenn Sie mit dem Löschen fortfahren, wird der Report unwiderruflich gelöscht.",
      onConfirm: () => {
        deleteReport(reportId);
      },
    });
  }

  return { deleteReportSeriesWithConfirmation, deleteReportWithConfirmation };
}
