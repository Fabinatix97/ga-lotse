/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import { useUpdateEvaluationTemplate } from "@/lib/businessModules/statistics/api/mutations/useUpdateEvaluationTemplate";
import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";
import { SaveEvaluationTemplateStep } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/SaveEvaluationTemplateStep/SaveEvaluationTemplateStep";
import {
  SidebarStepper,
  createStepContent,
} from "@/lib/shared/components/SidebarStepper/SidebarStepper";

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
      formRef={props.formRef}
      onSubmit={(model) =>
        updateEvaluationTemplate(props.evaluationTemplateId, model[0]).then(
          () => void 0,
        )
      }
      steps={[
        () => ({
          title: "Auswertungsvorlage bearbeiten",
          content: createStepContent({
            component: SaveEvaluationTemplateStep,
            componentProps: { evaluationDetails: evaluationTemplateDetails },
          }),
          initialValues: {
            name: evaluationTemplateDetails.name,
            description: evaluationTemplateDetails.description ?? "",
          },
        }),
      ]}
    />
  );
}
