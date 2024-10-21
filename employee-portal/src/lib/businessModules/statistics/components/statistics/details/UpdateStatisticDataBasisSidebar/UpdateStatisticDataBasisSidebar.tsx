/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";

import { useUpdateDataBasis } from "@/lib/businessModules/statistics/api/mutations/useUpdateDataBasis";
import { validateUpdateStatisticDataBasisStep } from "@/lib/businessModules/statistics/components/statistics/details/UpdateStatisticDataBasisSidebar/validateUpdateStatisticDataBasisStep";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

import { UpdateStatisticDataBasisStep } from "./UpdateStatisticDataBasisStep";
import { UpdateStatisticDataBasisFormModel } from "./updateStatisticDataBasisFormModel";

export function UpdateStatisticDataBasisSidebar({
  onClose,
  initialValues,
  statisticId,
}: {
  onClose: () => void;
  initialValues: UpdateStatisticDataBasisFormModel;
  statisticId: string;
}) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const updateStatisticDataBasis = useUpdateDataBasis({
    redirectRoute: routes.statistics.index,
  });

  async function handleSubmit(model: UpdateStatisticDataBasisFormModel) {
    await new Promise<void>((resolve) => {
      openConfirmationDialog({
        onConfirm: async () => {
          await updateStatisticDataBasis(statisticId, model.timeSpan);
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
            content: <UpdateStatisticDataBasisStep />,
            validator: validateUpdateStatisticDataBasisStep,
          },
        },
      ]}
    />
  );
}
