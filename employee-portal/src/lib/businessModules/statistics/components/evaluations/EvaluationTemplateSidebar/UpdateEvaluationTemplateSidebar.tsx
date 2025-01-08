/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useUpdateEvaluationTemplate } from "@/lib/businessModules/statistics/api/mutations/useUpdateEvaluationTemplate";
import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";
import { SaveEvaluationTemplateStep } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/SaveEvaluationTemplateStep/SaveEvaluationTemplateStep";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useUpdateEvaluationTemplateSidebar(): UseSidebarWithFormRefResult<UpdateEvaluationTemplateSidebarProps> {
  return useSidebarWithFormRef({
    component: UpdateEvaluationTemplateSidebar,
  });
}

interface UpdateEvaluationTemplateSidebarProps extends SidebarWithFormRefProps {
  evaluationTemplateId: string;
}

function UpdateEvaluationTemplateSidebar(
  props: UpdateEvaluationTemplateSidebarProps,
) {
  const evaluationTemplateDetails = useGetEvaluationTemplateDetails(
    props.evaluationTemplateId,
  );
  const updateEvaluationTemplate = useUpdateEvaluationTemplate(() =>
    props.onClose(true),
  );

  return (
    <SidebarStepper
      onClose={props.onClose}
      onSubmit={(model) =>
        updateEvaluationTemplate(props.evaluationTemplateId, model).then(
          () => void 0,
        )
      }
      initialValues={{
        name: evaluationTemplateDetails.name,
        description: evaluationTemplateDetails.description ?? "",
      }}
      formRef={props.formRef}
      steps={[
        {
          type: "StandardStep",
          step: {
            title: "Auswertungsvorlage bearbeiten",
            content: (
              <SaveEvaluationTemplateStep
                evaluationDetails={evaluationTemplateDetails}
              />
            ),
          },
        },
      ]}
    />
  );
}
