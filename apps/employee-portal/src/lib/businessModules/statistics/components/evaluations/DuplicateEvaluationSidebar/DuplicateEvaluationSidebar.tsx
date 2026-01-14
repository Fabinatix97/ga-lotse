/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import { useDuplicateEvaluation } from "@/lib/businessModules/statistics/api/mutations/useDuplicateEvaluation";
import { DuplicateEvaluationFormModel } from "@/lib/businessModules/statistics/components/evaluations/DuplicateEvaluationSidebar/duplicateEvaluationFormModel";
import {
  SidebarStepper,
  createStepContent,
} from "@/lib/shared/components/SidebarStepper/SidebarStepper";

import { DuplicateEvaluationStep } from "./DuplicateEvaluationStep";

export function useDuplicateEvaluationSidebar(): UseSidebarWithFormRefResult<DuplicateEvaluationSidebarProps> {
  return useSidebarWithFormRef({
    component: DuplicateEvaluationSidebar,
  });
}

export interface OriginalEvaluation {
  id: string;
  name: string;
  timeRangeStart: Date;
  timeRangeEnd: Date;
}

interface DuplicateEvaluationSidebarProps extends SidebarWithFormRefProps {
  originalEvaluation: OriginalEvaluation;
}

function DuplicateEvaluationSidebar(props: DuplicateEvaluationSidebarProps) {
  const duplicateEvaluation = useDuplicateEvaluation({
    onSuccess: () => props.onClose(true),
  });
  const defaultNewEvaluationName = `${props.originalEvaluation.name} - Kopie`;

  async function handleSubmit(model: [DuplicateEvaluationFormModel]) {
    const newEvaluationName =
      model[0].name === "" ? defaultNewEvaluationName : model[0].name;
    await duplicateEvaluation({
      originalEvaluationId: props.originalEvaluation.id,
      clonedEvaluationName: newEvaluationName,
    });
  }

  return (
    <SidebarStepper
      formRef={props.formRef}
      steps={[
        () => ({
          title: "Auswertung duplizieren",
          content: createStepContent({
            component: DuplicateEvaluationStep,
            componentProps: {
              originalEvaluation: props.originalEvaluation,
              defaultNewEvaluationName: defaultNewEvaluationName,
            },
          }),
          initialValues: {
            name: "",
          },
        }),
      ]}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    />
  );
}
