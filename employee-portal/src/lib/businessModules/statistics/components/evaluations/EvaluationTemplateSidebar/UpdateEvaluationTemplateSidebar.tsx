/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useUpdateEvaluationTemplate } from "@/lib/businessModules/statistics/api/mutations/useUpdateEvaluationTemplate";
import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";
import { SaveEvaluationTemplateStep } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/SaveEvaluationTemplateStep/SaveEvaluationTemplateStep";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";

export function UpdateEvaluationTemplateSidebar(props: {
  evaluationTemplateId: string;
  onClose: () => void;
}) {
  const evaluationTemplateDetails = useGetEvaluationTemplateDetails(
    props.evaluationTemplateId,
  );
  const updateEvaluationTemplate = useUpdateEvaluationTemplate(props.onClose);

  return (
    <SidebarStepper
      onClose={props.onClose}
      open={true}
      onSubmit={(model) =>
        updateEvaluationTemplate(props.evaluationTemplateId, model).then(
          () => void 0,
        )
      }
      initialValues={{
        name: evaluationTemplateDetails.name,
        description: evaluationTemplateDetails.description ?? "",
      }}
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
