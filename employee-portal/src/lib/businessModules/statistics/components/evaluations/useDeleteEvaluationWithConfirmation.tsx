/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";

import { useDeleteEvaluation } from "@/lib/businessModules/statistics/api/mutations/useDeleteEvaluation";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

export function useDeleteEvaluationWithConfirmation(onConfirm?: () => void) {
  const deleteEvaluation = useDeleteEvaluation();
  const { openConfirmationDialog } = useConfirmationDialog();
  return (evaluationId: string, evaluationName: string) =>
    openConfirmationDialog({
      title: "Auswertung löschen?",
      description: `Die Auswertung „${evaluationName}” wird dann unwiderruflich gelöscht.`,
      confirmLabel: "Löschen",
      children: (
        <Alert
          color="warning"
          message="Die Analysen der Auswertung werden ebenfalls unwiderruflich gelöscht."
        />
      ),
      onConfirm: () => {
        deleteEvaluation(evaluationId);
        onConfirm?.();
      },
      color: "danger",
    });
}
