/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { parseISO } from "date-fns";
import { useRouter } from "next/navigation";

import { AnonymizationOptions } from "@/lib/businessModules/statistics/api/models/anonymizationOptions";
import { useAddEvaluation } from "@/lib/businessModules/statistics/api/mutations/useAddEvaluation";
import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";
import { mapAnonymizedFieldValueToBoolean } from "@/lib/businessModules/statistics/components/evaluations/AnonymizationConfiguration";
import {
  ENUM_FALSE_VALUE,
  ENUM_TRUE_VALUE,
} from "@/lib/businessModules/statistics/components/evaluations/details/filter/enumFilterMappings";
import { CreateEvaluationStep } from "@/lib/businessModules/statistics/components/evaluations/templates/CreateEvaluationFromTemplateSidebar/CreateEvaluationStep/CreateEvaluationStep";
import { validateCreateEvaluationStep } from "@/lib/businessModules/statistics/components/evaluations/templates/CreateEvaluationFromTemplateSidebar/CreateEvaluationStep/validateCreateEvaluationStep";
import { CreateEvaluationFromTemplateFormModel } from "@/lib/businessModules/statistics/components/evaluations/templates/CreateEvaluationFromTemplateSidebar/createEvaluationFromTemplateFormModel";
import { getLastXMonthsTimeRange } from "@/lib/businessModules/statistics/components/evaluations/timeRangeHelper";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import {
  SidebarStepper,
  createStepContent,
} from "@/lib/shared/components/SidebarStepper/SidebarStepper";

import { CreateEvaluationStepFormModel } from "./CreateEvaluationStep/createEvaluationStepFormModel";

export function useCreateEvaluationFromTemplateSidebar(): UseSidebarWithFormRefResult<CreateEvaluationFromTemplateSidebarProps> {
  return useSidebarWithFormRef({
    component: CreateEvaluationFromTemplateSidebar,
  });
}

interface CreateEvaluationFromTemplateSidebarProps
  extends SidebarWithFormRefProps {
  evaluationTemplateId: string;
}

function CreateEvaluationFromTemplateSidebar(
  props: CreateEvaluationFromTemplateSidebarProps,
) {
  const router = useRouter();

  const evaluationTemplateDetails = useGetEvaluationTemplateDetails(
    props.evaluationTemplateId,
  );
  const addEvaluation = useAddEvaluation({
    onSuccess: () => {
      props.onClose(true);
      router.push(routes.evaluations.index);
    },
  });

  async function onSubmit(model: CreateEvaluationFromTemplateFormModel) {
    await addEvaluation({
      type: "AddEvaluationWithTemplateRequest",
      templateId: props.evaluationTemplateId,
      name: model[0].name,
      anonymized: mapAnonymizedFieldValueToBoolean(model[0].anonymized),
      timeRangeStart: parseISO(model[0].timeSpan.start),
      timeRangeEnd: parseISO(model[0].timeSpan.end),
    });
  }

  return (
    <SidebarStepper
      onClose={props.onClose}
      formRef={props.formRef}
      onSubmit={onSubmit}
      steps={[
        () => ({
          title: "Auswertung erstellen",
          content: createStepContent({
            component: CreateEvaluationStep,
            componentProps: { evaluationTemplateDetails },
          }),
          initialValues: {
            name: "",
            anonymized:
              evaluationTemplateDetails.anonymizationOptions ===
              AnonymizationOptions.NotAnonymizable
                ? ENUM_FALSE_VALUE
                : ENUM_TRUE_VALUE,
            timeSpan: getLastXMonthsTimeRange(3),
          } as CreateEvaluationStepFormModel,
          validator: validateCreateEvaluationStep,
          onSubmit,
        }),
      ]}
    />
  );
}
