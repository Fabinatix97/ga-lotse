/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";

import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

import { UpdateStatisticDataBasisStep } from "./UpdateStatisticDataBasisStep";
import { UpdateStatisticDataBasisFormModel } from "./updateStatisticDataBasisFormModel";

export function UpdateStatisticDataBasisSidebar({
  onClose,
  initialValues,
}: {
  onClose: () => void;
  initialValues: UpdateStatisticDataBasisFormModel;
}) {
  const { openConfirmationDialog } = useConfirmationDialog();

  async function onSubmit() {
    await new Promise<void>((resolve) => {
      openConfirmationDialog({
        onConfirm: () => {
          resolve();
          onClose();
        },
        onClose: resolve,
        title: "Datenbasis aktualisieren?",
        children: (
          <Alert
            color="warning"
            message="Wenn Sie fortfahren, wird die Datenbasis für diese Statistik unwiderruflich ersetzt."
          />
        ),
        cancelLabel: "Abbrechen",
        confirmLabel: "Ja, aktualisieren",
      });
    });
  }

  return (
    <SidebarStepper
      onClose={onClose}
      open={true}
      onSubmit={onSubmit}
      initialValues={initialValues}
      saveLabel="Aktualisieren"
      steps={[
        {
          type: "StandardStep",
          step: {
            title: "Datenbasis aktualisieren",
            content: <UpdateStatisticDataBasisStep />,
          },
        },
      ]}
    />
  );
}
