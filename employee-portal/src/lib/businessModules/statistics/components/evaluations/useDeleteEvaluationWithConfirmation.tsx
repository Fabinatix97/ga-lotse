/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useConfirmationDialog } from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal/components/Alert";

import { useDeleteEvaluation } from "@/lib/businessModules/statistics/api/mutations/useDeleteEvaluation";

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
