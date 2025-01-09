/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

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
      name: model.name,
      anonymized: mapAnonymizedFieldValueToBoolean(model.anonymized),
      timeRangeStart: parseISO(model.timeSpan.start),
      timeRangeEnd: parseISO(model.timeSpan.end),
    });
  }

  return (
    <SidebarStepper
      onClose={props.onClose}
      onSubmit={onSubmit}
      initialValues={{
        name: "",
        anonymized:
          evaluationTemplateDetails.anonymizationOptions ===
          AnonymizationOptions.NotAnonymizable
            ? ENUM_FALSE_VALUE
            : ENUM_TRUE_VALUE,
        timeSpan: getLastXMonthsTimeRange(3),
      }}
      formRef={props.formRef}
      steps={[
        {
          type: "StandardStep",
          step: {
            title: "Auswertung erstellen",
            content: (
              <CreateEvaluationStep
                evaluationTemplateDetails={evaluationTemplateDetails}
              />
            ),
            validator: validateCreateEvaluationStep,
          },
        },
      ]}
    />
  );
}
