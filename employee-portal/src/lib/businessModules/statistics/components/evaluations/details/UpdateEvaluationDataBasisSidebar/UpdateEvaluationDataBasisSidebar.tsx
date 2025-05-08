/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal/components/Alert";

import { useUpdateDataBasis } from "@/lib/businessModules/statistics/api/mutations/useUpdateDataBasis";
import { validateUpdateEvaluationDataBasisStep } from "@/lib/businessModules/statistics/components/evaluations/details/UpdateEvaluationDataBasisSidebar/validateUpdateEvaluationDataBasisStep";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import {
  SidebarStepper,
  createStepContent,
} from "@/lib/shared/components/SidebarStepper/SidebarStepper";

import { UpdateEvaluationDataBasisStep } from "./UpdateEvaluationDataBasisStep";
import { UpdateEvaluationDataBasisFormModel } from "./updateEvaluationDataBasisFormModel";

export function useUpdateEvaluationDataBasisSidebar(): UseSidebarWithFormRefResult<UpdateEvaluationDataBasisSidebarProps> {
  return useSidebarWithFormRef({
    component: UpdateEvaluationDataBasisSidebar,
  });
}

interface UpdateEvaluationDataBasisSidebarProps
  extends SidebarWithFormRefProps {
  initialValues: UpdateEvaluationDataBasisFormModel;
  evaluationId: string;
}

function UpdateEvaluationDataBasisSidebar({
  onClose,
  initialValues,
  evaluationId,
  formRef,
}: UpdateEvaluationDataBasisSidebarProps) {
  const updateDataBasis = useUpdateDataBasis({
    redirectRoute: routes.evaluations.index,
  });

  const confirmationDialogOptions = {
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
  };

  async function handleSubmit(model: [UpdateEvaluationDataBasisFormModel]) {
    await updateDataBasis(evaluationId, model[0].timeSpan);
    onClose(true);
  }

  return (
    <SidebarStepper
      formRef={formRef}
      saveLabel="Aktualisieren"
      confirmationDialog={confirmationDialogOptions}
      steps={[
        () => ({
          title: "Datenbasis aktualisieren",
          content: createStepContent({
            component: UpdateEvaluationDataBasisStep,
          }),
          initialValues,
          validator: validateUpdateEvaluationDataBasisStep,
        }),
      ]}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
}
