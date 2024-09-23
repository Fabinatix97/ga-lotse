/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useUpdateEvaluation } from "@/lib/businessModules/statistics/api/mutations/useUpdateEvaluation";
import { SidebarStepper } from "@/lib/businessModules/statistics/components/shared/SidebarStepper/SidebarStepper";
import { SidebarStep } from "@/lib/businessModules/statistics/components/shared/SidebarStepper/sidebarStep";
import { SaveEvaluationStep } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/SaveEvaluationStep/SaveEvaluationStep";
import { UpdateEvaluationFormModel } from "@/lib/businessModules/statistics/components/statistics/details/UpdateEvaluationSidebar/updateEvaluationFormModel";

export function UpdateEvaluationSidebar(props: {
  open: boolean;
  onClose: () => void;
  evaluationId: string;
  name: string;
}) {
  const updateEvaluation = useUpdateEvaluation(
    props.evaluationId,
    props.onClose,
  );

  return (
    <SidebarStepper
      open={props.open}
      onClose={props.onClose}
      onSubmit={updateEvaluation}
      initialValues={{
        name: props.name,
      }}
      steps={
        [
          {
            type: "StandardStep",
            step: {
              title: "Änderungen speichern",
              content: <SaveEvaluationStep />,
            },
          },
        ] satisfies SidebarStep<UpdateEvaluationFormModel>[]
      }
    />
  );
}
