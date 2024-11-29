/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStatisticsFeature } from "@eshg/employee-portal-api/statistics";
import { parseISO } from "date-fns";
import { useRouter } from "next/navigation";

import { useAddEvaluation } from "@/lib/businessModules/statistics/api/mutations/useAddEvaluation";
import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/statistics/api/queries/useStatisticsFeatureToggle";
import { mapAnonymizedFieldValueToBoolean } from "@/lib/businessModules/statistics/components/evaluations/AnonymizedToggleButtonGroupField";
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

export function CreateEvaluationFromTemplateSidebarStepper(props: {
  evaluationTemplateId: string;
  onClose: () => void;
}) {
  const router = useRouter();

  const fakeAnonymizationEnabled = useIsNewFeatureEnabled(
    ApiStatisticsFeature.FakeAnonymization,
  );

  const evaluationTemplateDetails = useGetEvaluationTemplateDetails(
    props.evaluationTemplateId,
  );
  const addEvaluation = useAddEvaluation({
    onSuccess: () => {
      props.onClose();
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
      open={true}
      onSubmit={onSubmit}
      initialValues={{
        name: "",
        anonymized: fakeAnonymizationEnabled
          ? ENUM_TRUE_VALUE
          : ENUM_FALSE_VALUE,
        timeSpan: getLastXMonthsTimeRange(3),
      }}
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
