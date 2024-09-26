/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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

  function deleteReportWithConfirmation(seriesId: string, reportName: string) {
    openConfirmationDialog({
      title: "Report löschen?",
      description: `Der Report "${reportName}" wird dann unwiderruflich gelöscht.`,
      confirmLabel: "Report löschen",
      color: "danger",
      onConfirm: () => {
        deleteReport(seriesId);
      },
    });
  }

  return deleteReportWithConfirmation;
}
