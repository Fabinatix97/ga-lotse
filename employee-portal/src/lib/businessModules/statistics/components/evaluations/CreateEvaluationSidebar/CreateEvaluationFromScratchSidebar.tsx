/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SidebarFormHandle } from "@eshg/lib-employee-portal";
import { parseISO } from "date-fns";
import { Ref } from "react";
import { groupBy, isDefined } from "remeda";

import { AnonymizationOptions } from "@/lib/businessModules/statistics/api/models/anonymizationOptions";
import { useAddEvaluation } from "@/lib/businessModules/statistics/api/mutations/useAddEvaluation";
import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/mutations/useGetEvaluationTemplateDetails";
import {
  AnonymizedFieldValue,
  mapAnonymizedFieldValueToBoolean,
} from "@/lib/businessModules/statistics/components/evaluations/AnonymizationConfiguration";
import { ChooseAttributesStep } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseAttributesStep/ChooseAttributesStep";
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
import { ENUM_TRUE_VALUE } from "@/lib/businessModules/statistics/components/evaluations/details/filter/enumFilterMappings";
import { getLastXMonthsTimeRange } from "@/lib/businessModules/statistics/components/evaluations/timeRangeHelper";
import {
  SidebarStepper,
  createStepContent,
} from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import { isEqualTimeSpan } from "@/lib/shared/components/formFields/TimeSpanField";

export const CHOOSE_EVALUATION_TEMPLATE = "CHOOSE_EVALUATION_TEMPLATE";

export function willBeAnonymized(
  anonymized: AnonymizedFieldValue,
  anonymizationOptions: AnonymizationOptions,
) {
  switch (anonymizationOptions) {
    case AnonymizationOptions.Choice:
      return mapAnonymizedFieldValueToBoolean(anonymized);
    case AnonymizationOptions.AlwaysAnonymize:
      return true;
    case AnonymizationOptions.NotAnonymizable:
      return false;
  }
}

export function CreateEvaluationFromScratchSidebar({
  onClose,
  dataSources,
  evaluationTemplates,
  formRef,
}: {
  onClose: (force?: boolean) => void;
  dataSources: DataSource[];
  evaluationTemplates: EvaluationTemplateStepAutocompleteEntry[];
  formRef: Ref<SidebarFormHandle>;
}) {
  const getEvaluationTemplateDetails = useGetEvaluationTemplateDetails();
  const addEvaluation = useAddEvaluation({
    onSuccess: () => onClose(true),
  });

  function getDataSourceFromId(dataSourceId: string) {
    return dataSources.find((it) => it.id === dataSourceId);
  }

  function getAttributesFromKeys(
    attributeKeys: string[],
    dataSource: DataSource,
  ) {
    return dataSource.attributes.filter((attribute) =>
      attributeKeys.includes(attribute.key),
    );
  }

  async function onSubmit(model: CreateEvaluationFromScratchFormModel) {
    if (model[0].dataSourceId === CHOOSE_EVALUATION_TEMPLATE) {
      const evaluationTemplate = await getEvaluationTemplateDetails(
        model[1].evaluationTemplateId!,
      );
      await addEvaluation({
        type: "AddEvaluationWithTemplateRequest",
        name: model[3].evaluationName.trim(),
        timeRangeStart: parseISO(model[2].timeSpan.start),
        timeRangeEnd: parseISO(model[2].timeSpan.end),
        templateId: model[1].evaluationTemplateId!,
        anonymized: willBeAnonymized(
          model[2].anonymized,
          evaluationTemplate.anonymizationOptions,
        ),
      });
    } else {
      const dataSource = getDataSourceFromId(model[0].dataSourceId!)!;
      const attributeProcedureReference = dataSource.attributes.find(
        (attribute) => attribute.code === "PROCEDURE_REFERENCE",
      )?.code;
      const attributeGroups = groupBy(
        getAttributesFromKeys(
          [
            ...model[1].selectedAttributeKeys!.values(),
            attributeProcedureReference,
          ].filter(isDefined),
          dataSource,
        ),
        (item) => item.code,
      );

      await addEvaluation({
        type: "AddEvaluationWithDataSourcesRequest",
        name: model[3].evaluationName.trim(),
        dataSources: [
          {
            businessModuleName: dataSource.businessModule,
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
            id: dataSource.id,
          },
        ],
        timeRangeStart: parseISO(model[2].timeSpan.start),
        timeRangeEnd: parseISO(model[2].timeSpan.end),
        anonymized: willBeAnonymized(
          model[2].anonymized,
          dataSource.anonymizationOptions,
        ),
      });
    }
  }

  return (
    <SidebarStepper
      onClose={onClose}
      formRef={formRef}
      onSubmit={onSubmit}
      steps={[
        () => ({
          title: "Neue Auswertung erstellen",
          content: createStepContent({
            component: ChooseDataSourceStep,
            componentProps: { dataSources },
          }),
          validator: validateChooseDataSourceStep(evaluationTemplates.length),
          initialValues: { dataSourceId: "" },
        }),
        (prevStepsValues) => {
          if (prevStepsValues[0].dataSourceId === CHOOSE_EVALUATION_TEMPLATE) {
            return {
              title: "Auswertungsvorlagen",
              content: createStepContent({
                component: ChooseEvaluationTemplateStep,
                componentProps: { evaluationTemplates },
              }),
              initialValues: {
                evaluationTemplateId: "",
              },
            };
          } else {
            const dataSource = getDataSourceFromId(
              prevStepsValues[0].dataSourceId!,
            );
            return {
              title: "Attribute wählen",
              content: createStepContent({
                component: ChooseAttributesStep,
                componentProps: {
                  attributes: dataSource!.attributes,
                  dataSourceName: dataSource!.name,
                },
              }),
              initialValues: {
                selectedAttributeKeys: new Set<string>(),
              },
              validator: validateChooseAttributeStep,
            };
          }
        },
        (prevStepsValues) => {
          const isEvaluationTemplateBranch =
            prevStepsValues[0].dataSourceId === CHOOSE_EVALUATION_TEMPLATE;
          const dataSource = !isEvaluationTemplateBranch
            ? getDataSourceFromId(prevStepsValues[0].dataSourceId!)
            : undefined;
          const initialTimeSpan = getLastXMonthsTimeRange(3);
          return {
            title: "Datenquelle konfigurieren",
            content: createStepContent({
              component: ConfigureDataSourceStep,
              componentProps: {
                isEvaluationTemplateBranch,
                dataSource,
                evaluationTemplateId: prevStepsValues[1].evaluationTemplateId,
                explicitStartAndEnd:
                  isDefined(prevStepsValues[2]) &&
                  !isEqualTimeSpan(
                    prevStepsValues[2].timeSpan,
                    initialTimeSpan,
                  ),
              },
            }),
            initialValues: {
              timeSpan: initialTimeSpan,
              anonymized: ENUM_TRUE_VALUE as AnonymizedFieldValue,
            },
            validator: validateConfigureDataSourceStep,
          };
        },
        (prevStepsValues) => {
          const isEvaluationTemplateBranch =
            prevStepsValues[0].dataSourceId === CHOOSE_EVALUATION_TEMPLATE;
          const dataSource = !isEvaluationTemplateBranch
            ? getDataSourceFromId(prevStepsValues[0].dataSourceId!)
            : undefined;
          return {
            title: "Zusammenfassung",
            content: createStepContent({
              component: SummaryStep,
              componentProps: {
                isEvaluationTemplateBranch,
                timeSpan: prevStepsValues[2].timeSpan,
                anonymized: prevStepsValues[2].anonymized,
                dataSource: dataSource,
                selectedAttributes:
                  isDefined(prevStepsValues[1].selectedAttributeKeys) &&
                  isDefined(dataSource)
                    ? getAttributesFromKeys(
                        [...prevStepsValues[1].selectedAttributeKeys.values()],
                        dataSource,
                      )
                    : undefined,
                evaluationTemplateId: prevStepsValues[1].evaluationTemplateId,
              },
            }),
            initialValues: { evaluationName: "" },
          };
        },
      ]}
    />
  );
}
