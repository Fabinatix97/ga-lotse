/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";

import { useUpdateDataBasis } from "@/lib/businessModules/statistics/api/mutations/useUpdateDataBasis";
import { validateUpdateEvaluationDataBasisStep } from "@/lib/businessModules/statistics/components/evaluations/details/UpdateEvaluationDataBasisSidebar/validateUpdateEvaluationDataBasisStep";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

import { UpdateEvaluationDataBasisStep } from "./UpdateEvaluationDataBasisStep";
import { UpdateEvaluationDataBasisFormModel } from "./updateEvaluationDataBasisFormModel";

export function UpdateEvaluationDataBasisSidebar({
  onClose,
  initialValues,
  evaluationId,
}: {
  onClose: () => void;
  initialValues: UpdateEvaluationDataBasisFormModel;
  evaluationId: string;
}) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const updateDataBasis = useUpdateDataBasis({
    redirectRoute: routes.evaluations.index,
  });

  async function handleSubmit(model: UpdateEvaluationDataBasisFormModel) {
    await new Promise<void>((resolve) => {
      openConfirmationDialog({
        onConfirm: async () => {
          await updateDataBasis(evaluationId, model.timeSpan);
          onClose();
        },
        onClose: resolve,
        title: "Datenbasis aktualisieren?",
        hideDescription: true,
        children: (
          <Alert
            color="warning"
            message="Wenn Sie fortfahren, wird die Datenbasis für diese Auswertung unwiderruflich ersetzt."
          />
        ),
        cancelLabel: "Abbrechen",
        confirmLabel: "Aktualisieren",
      });
    });
  }

  return (
    <SidebarStepper
      onClose={onClose}
      open={true}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      saveLabel="Aktualisieren"
      steps={[
        {
          type: "StandardStep",
          step: {
            title: "Datenbasis aktualisieren",
            content: <UpdateEvaluationDataBasisStep />,
            validator: validateUpdateEvaluationDataBasisStep,
          },
        },
      ]}
    />
  );
}
