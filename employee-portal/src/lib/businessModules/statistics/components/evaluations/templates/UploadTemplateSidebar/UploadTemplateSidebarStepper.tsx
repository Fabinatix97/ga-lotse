/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatPersonName } from "@eshg/lib-portal/formatters/person";

import { useGetSelfUser } from "@/lib/baseModule/api/queries/users";
import { useUploadEvaluationTemplate } from "@/lib/businessModules/statistics/api/mutations/useUploadEvaluationTemplate";
import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";

import { UploadTemplateStep } from "./UploadTemplateStep";
import { UploadTemplateFormModel } from "./uploadTemplateFormModel";

export function UploadTemplateSidebarStepper(props: {
  templateId: string;
  onClose: () => void;
}) {
  const { data: selfUser } = useGetSelfUser();
  const evaluationTemplateDetails = useGetEvaluationTemplateDetails(
    props.templateId,
  );
  const uploadTemplate = useUploadEvaluationTemplate(props.onClose);

  async function onSubmit(model: UploadTemplateFormModel) {
    await uploadTemplate(props.templateId, model);
  }

  return (
    <SidebarStepper
      onClose={props.onClose}
      open={true}
      onSubmit={onSubmit}
      initialValues={{
        name: evaluationTemplateDetails.name,
        description: evaluationTemplateDetails.description ?? "",
        contact: `${formatPersonName(selfUser)} (${selfUser.email})`,
      }}
      saveLabel="Hochladen"
      steps={[
        {
          type: "StandardStep",
          step: {
            title: "Auswertungsvorlage hochladen",
            content: (
              <UploadTemplateStep
                evaluationTemplateDetails={evaluationTemplateDetails}
              />
            ),
          },
        },
      ]}
    />
  );
}
