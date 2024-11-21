/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";

import { useDeleteStatistic } from "@/lib/businessModules/statistics/api/mutations/useDeleteStatistic";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

export function useDeleteStatisticWithConfirmation(onConfirm?: () => void) {
  const deleteStatistic = useDeleteStatistic();
  const { openConfirmationDialog } = useConfirmationDialog();
  return (statisticId: string, statisticsName: string) =>
    openConfirmationDialog({
      title: "Auswertung löschen?",
      description: `Die Auswertung "${statisticsName}" wird dann unwiderruflich gelöscht.`,
      confirmLabel: "Löschen",
      children: (
        <Alert
          color="warning"
          message="Die Analysen der Auswertung werden ebenfalls unwiderruflich gelöscht."
        />
      ),
      onConfirm: () => {
        deleteStatistic(statisticId);
        onConfirm?.();
      },
      color: "danger",
    });
}
