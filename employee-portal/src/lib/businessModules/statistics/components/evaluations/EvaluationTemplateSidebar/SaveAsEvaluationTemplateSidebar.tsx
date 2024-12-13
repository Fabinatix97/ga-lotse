/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useAddEvaluationTemplate } from "@/lib/businessModules/statistics/api/mutations/useAddEvaluationTemplate";
import { useGetEvaluationDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationDetails";
import { SaveEvaluationTemplateStep } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/SaveEvaluationTemplateStep/SaveEvaluationTemplateStep";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useSaveAsEvaluationTemplateSidebar(): UseSidebarWithFormRefResult<SaveAsEvaluationTemplateSidebarProps> {
  return useSidebarWithFormRef({
    component: SaveAsEvaluationTemplateSidebar,
  });
}

interface SaveAsEvaluationTemplateSidebarProps extends SidebarWithFormRefProps {
  evaluationId: string;
}

function SaveAsEvaluationTemplateSidebar({
  onClose,
  evaluationId,
  formRef,
}: SaveAsEvaluationTemplateSidebarProps) {
  const evaluationDetails = useGetEvaluationDetails(evaluationId);
  const addEvaluationTemplate = useAddEvaluationTemplate(() => onClose(true));

  return (
    <SidebarStepper
      onClose={onClose}
      onSubmit={(model) =>
        addEvaluationTemplate(evaluationId, model).then(() => void 0)
      }
      initialValues={{
        name: "",
        description: "",
      }}
      formRef={formRef}
      steps={[
        {
          type: "StandardStep",
          step: {
            title: "Vorlage speichern",
            content: (
              <SaveEvaluationTemplateStep
                evaluationDetails={evaluationDetails}
              />
            ),
          },
        },
      ]}
    />
  );
}
