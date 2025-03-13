/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useGetSelfUser } from "@eshg/lib-employee-portal";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";

import { useUploadEvaluationTemplate } from "@/lib/businessModules/statistics/api/mutations/useUploadEvaluationTemplate";
import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";
import {
  SidebarStepper,
  createStepContent,
} from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

import { UploadTemplateStep } from "./UploadTemplateStep";
import { UploadTemplateFormModel } from "./uploadTemplateFormModel";

export function useUploadTemplateSidebar(): UseSidebarWithFormRefResult<UploadTemplateSidebarProps> {
  return useSidebarWithFormRef({
    component: UploadTemplateSidebar,
  });
}

interface UploadTemplateSidebarProps extends SidebarWithFormRefProps {
  templateId: string;
}

function UploadTemplateSidebar(props: UploadTemplateSidebarProps) {
  const { data: selfUser } = useGetSelfUser();
  const evaluationTemplateDetails = useGetEvaluationTemplateDetails(
    props.templateId,
  );
  const uploadTemplate = useUploadEvaluationTemplate(() => props.onClose(true));

  async function onSubmit(model: [UploadTemplateFormModel]) {
    await uploadTemplate(props.templateId, model[0]);
  }

  return (
    <SidebarStepper
      onClose={props.onClose}
      formRef={props.formRef}
      saveLabel="Hochladen"
      onSubmit={onSubmit}
      steps={[
        () => ({
          title: "Auswertungsvorlage hochladen",
          content: createStepContent({
            component: UploadTemplateStep,
            componentProps: { evaluationTemplateDetails },
          }),
          initialValues: {
            name: evaluationTemplateDetails.name,
            description: evaluationTemplateDetails.description ?? "",
            contact: `${formatPersonName(selfUser)} (${selfUser.email})`,
          },
        }),
      ]}
    />
  );
}
