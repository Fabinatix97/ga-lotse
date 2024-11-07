/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useAddEvaluationTemplate } from "@/lib/businessModules/statistics/api/mutations/useAddEvaluationTemplate";
import { useGetEvaluationDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationDetails";
import { SaveEvaluationTemplateStep } from "@/lib/businessModules/statistics/components/statistics/SaveAsEvaluationTemplateSidebar/SaveEvaluationTemplateStep/SaveEvaluationTemplateStep";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";

export function SaveAsEvaluationTemplateSidebar({
  open,
  onClose,
  evaluationId,
}: {
  open: boolean;
  onClose: () => void;
  evaluationId: string;
}) {
  const evaluationDetails = useGetEvaluationDetails(evaluationId);
  const addEvaluationTemplate = useAddEvaluationTemplate(onClose);

  return (
    <SidebarStepper
      onClose={onClose}
      open={open}
      onSubmit={(model) =>
        addEvaluationTemplate(evaluationId, model).then(() => void 0)
      }
      initialValues={{
        name: "",
        description: "",
      }}
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
