/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useDuplicateEvaluation } from "@/lib/businessModules/statistics/api/mutations/useDuplicateEvaluation";
import { DuplicateEvaluationFormModel } from "@/lib/businessModules/statistics/components/evaluations/DuplicateEvaluationSidebar/duplicateEvaluationFormModel";
import { UpdateDiagramFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/UpdateDiagramSidebar/updateDiagramFormModel";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import { SidebarStep } from "@/lib/shared/components/SidebarStepper/sidebarStep";

import { DuplicateEvaluationStep } from "./DuplicateEvaluationStep";

export interface OriginalEvaluation {
  id: string;
  name: string;
  timeRangeStart: Date;
  timeRangeEnd: Date;
}

export function DuplicateEvaluationSidebar(props: {
  onClose: () => void;
  originalEvaluation: OriginalEvaluation;
}) {
  const duplicateEvaluation = useDuplicateEvaluation({
    onSuccess: props.onClose,
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
      open={true}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      initialValues={{
        name: "",
      }}
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
