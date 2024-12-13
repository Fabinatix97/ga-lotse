/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useDuplicateEvaluation } from "@/lib/businessModules/statistics/api/mutations/useDuplicateEvaluation";
import { DuplicateEvaluationFormModel } from "@/lib/businessModules/statistics/components/evaluations/DuplicateEvaluationSidebar/duplicateEvaluationFormModel";
import { UpdateDiagramFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/UpdateDiagramSidebar/updateDiagramFormModel";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import { SidebarStep } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

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

  async function handleSubmit(model: DuplicateEvaluationFormModel) {
    const newEvaluationName =
      model.name === "" ? defaultNewEvaluationName : model.name;
    await duplicateEvaluation({
      originalEvaluationId: props.originalEvaluation.id,
      clonedEvaluationName: newEvaluationName,
    });
  }

  return (
    <SidebarStepper
      onClose={props.onClose}
      onSubmit={handleSubmit}
      initialValues={{
        name: "",
      }}
      formRef={props.formRef}
      steps={
        [
          {
            type: "StandardStep",
            step: {
              title: "Auswertung duplizieren",
              content: (
                <DuplicateEvaluationStep
                  originalEvaluation={props.originalEvaluation}
                  defaultNewEvaluationName={defaultNewEvaluationName}
                />
              ),
            },
          },
        ] satisfies SidebarStep<UpdateDiagramFormModel>[]
      }
    />
  );
}
