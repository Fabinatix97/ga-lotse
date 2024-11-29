/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStatisticsFeature } from "@eshg/employee-portal-api/statistics";
import { parseISO } from "date-fns";
import { groupBy, identity, isDefined } from "remeda";

import { useAddEvaluation } from "@/lib/businessModules/statistics/api/mutations/useAddEvaluation";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/statistics/api/queries/useStatisticsFeatureToggle";
import { mapAnonymizedFieldValueToBoolean } from "@/lib/businessModules/statistics/components/evaluations/AnonymizedToggleButtonGroupField";
import {
  CategorizedFlatAttribute,
  ChooseAttributesStep,
} from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseAttributesStep/ChooseAttributesStep";
import { validateChooseAttributeStep } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseAttributesStep/validateChooseAttributeStep";
import {
  ChooseDataSourceStep,
  DataSource,
} from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseDataSourceStep/ChooseDataSourceStep";
import { validateChooseDataSourceStep } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseDataSourceStep/validateChooseDataSourceStep";
import {
  ChooseEvaluationTemplateStep,
  EvaluationTemplateStepAutocompleteEntry,
} from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseEvaluationTemplateStep/ChooseEvaluationTemplateStep";
import { ConfigureDataSourceStep } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ConfigureDataSourceStep/ConfigureDataSourceStep";
import { validateConfigureDataSourceStep } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ConfigureDataSourceStep/validateConfigureDataSourceStep";
import { SummaryStep } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/SummaryStep/SummaryStep";
import { CreateEvaluationFromScratchFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/createEvaluationFromScratchFormModel";
import {
  ENUM_FALSE_VALUE,
  ENUM_TRUE_VALUE,
} from "@/lib/businessModules/statistics/components/evaluations/details/filter/enumFilterMappings";
import { getLastXMonthsTimeRange } from "@/lib/businessModules/statistics/components/evaluations/timeRangeHelper";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";

export function CreateEvaluationFromScratchSidebar({
  open,
  onClose,
  dataSources,
  attributesByDataSourceId,
  evaluationTemplates,
}: {
  open: boolean;
  onClose: () => void;
  dataSources: DataSource[];
  attributesByDataSourceId: Record<string, CategorizedFlatAttribute[]>;
  evaluationTemplates: EvaluationTemplateStepAutocompleteEntry[];
}) {
  const fakeAnonymizationEnabled = useIsNewFeatureEnabled(
    ApiStatisticsFeature.FakeAnonymization,
  );

  const initialValues: CreateEvaluationFromScratchFormModel = {
    evaluationName: "",
    timeSpan: getLastXMonthsTimeRange(3),
    evaluationTemplateId: null,
    _dataSourceId: "",
    _selectedAttributeKeys: [],
    anonymized: fakeAnonymizationEnabled ? ENUM_TRUE_VALUE : ENUM_FALSE_VALUE,
  };
  const addEvaluation = useAddEvaluation({
    onSuccess: onClose,
  });

  async function onSubmit(model: CreateEvaluationFromScratchFormModel) {
    if (model._dataSourceId === "CHOOSE_EVALUATION_TEMPLATE") {
      await addEvaluation({
        type: "AddEvaluationWithTemplateRequest",
        name: model.evaluationName.trim(),
        timeRangeStart: parseISO(model.timeSpan.start),
        timeRangeEnd: parseISO(model.timeSpan.end),
        templateId: model.evaluationTemplateId!,
        anonymized: mapAnonymizedFieldValueToBoolean(model.anonymized),
      });
    } else {
      const attributeGroups = groupBy(
        model.selectedAttributes!,
        (item) => item.code,
      );

      await addEvaluation({
        type: "AddEvaluationWithDataSourcesRequest",
        name: model.evaluationName.trim(),
        dataSources: [
          {
            businessModuleName: model.dataSource!.businessModule,
            attributeCodes: Object.entries(attributeGroups).map(
              ([code, attributes]) => {
                const baseAttributes = attributes
                  .filter((it) => isDefined(it.baseCode))
                  .map((it) => it.baseCode!);
                return {
                  code: code,
                  baseAttributeCodes:
                    baseAttributes.length > 0 ? baseAttributes : undefined,
                };
              },
            ),
            id: model.dataSource!.id,
          },
        ],
        timeRangeStart: parseISO(model.timeSpan.start),
        timeRangeEnd: parseISO(model.timeSpan.end),
        anonymized: mapAnonymizedFieldValueToBoolean(model.anonymized),
      });
    }
  }

  return (
    <SidebarStepper
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      initialValues={initialValues}
      steps={[
        {
          type: "StandardStep",
          step: {
            title: "Neue Auswertung erstellen",
            content: <ChooseDataSourceStep dataSources={dataSources} />,
            validator: validateChooseDataSourceStep(evaluationTemplates.length),
          },
        },
        {
          type: "BranchingStep",
          branch: (model) => {
            if (model._dataSourceId !== "CHOOSE_EVALUATION_TEMPLATE") {
              const attributes =
                attributesByDataSourceId[model._dataSourceId!] ??
                Object.values(attributesByDataSourceId).flatMap(identity());
              return {
                title: "Attribute wählen",
                content: <ChooseAttributesStep attributes={attributes} />,
                validator: validateChooseAttributeStep,
              };
            } else {
              return {
                title: "Auswertungsvorlagen",
                content: (
                  <ChooseEvaluationTemplateStep
                    evaluationTemplates={evaluationTemplates}
                  />
                ),
              };
            }
          },
        },
        {
          type: "StandardStep",
          step: {
            title: "Datenquelle konfigurieren",
            content: <ConfigureDataSourceStep />,
            validator: validateConfigureDataSourceStep,
          },
        },
        {
          type: "StandardStep",
          step: {
            title: "Zusammenfassung",
            content: <SummaryStep />,
          },
        },
      ]}
    />
  );
}
