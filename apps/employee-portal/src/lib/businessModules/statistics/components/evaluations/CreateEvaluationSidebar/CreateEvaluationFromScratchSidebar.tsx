/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { parseISO } from "date-fns";
import { Ref } from "react";
import { isDefined } from "remeda";

import { SidebarFormHandle } from "@eshg/lib-employee-portal";

import { AnonymizationOptions } from "@/lib/businessModules/statistics/api/models/anonymizationOptions";
import { useAddEvaluation } from "@/lib/businessModules/statistics/api/mutations/useAddEvaluation";
import {
  AnonymizedFieldValue,
  mapAnonymizedFieldValueToBoolean,
} from "@/lib/businessModules/statistics/components/evaluations/AnonymizationConfiguration";
import {
  ChooseAttributesStep,
  extractAttributeKey,
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
import { ConfigureDataSourceStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ConfigureDataSourceStep/configureDataSourceStepFormModel";
import { validateConfigureDataSourceStep } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ConfigureDataSourceStep/validateConfigureDataSourceStep";
import { SummaryStep } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/SummaryStep/SummaryStep";
import { CreateEvaluationFromScratchFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/createEvaluationFromScratchFormModel";
import {
  ENUM_FALSE_VALUE,
  ENUM_TRUE_VALUE,
} from "@/lib/businessModules/statistics/components/evaluations/details/filter/enumFilterMappings";
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
    case AnonymizationOptions.AlwaysInternal:
    case AnonymizationOptions.NotAnonymizable:
      return false;
    case AnonymizationOptions.Neither:
      throw new Error("A form with the option 'Neither' can't be submitted!");
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
    // To maintain the order from the attributeKeys
    const keyToFlatAttribute = new Map(
      dataSource.attributes.map((it) => [it.key, it]),
    );

    function extractKey(key: string) {
      // Special case introduced in onSubmit
      if (key === "PROCEDURE_REFERENCE") {
        return key;
      }
      return extractAttributeKey(key);
    }

    return attributeKeys.map((it) => keyToFlatAttribute.get(extractKey(it))!);
  }

  async function onSubmit(model: CreateEvaluationFromScratchFormModel) {
    if (model[0].dataSourceId === CHOOSE_EVALUATION_TEMPLATE) {
      await addEvaluation({
        type: "AddEvaluationWithTemplateRequest",
        name: model[3].evaluationName.trim(),
        timeRangeStart: parseISO(model[2].timeSpan!.start),
        timeRangeEnd: parseISO(model[2].timeSpan!.end),
        templateId: model[1].evaluationTemplateId!,
        anonymized: willBeAnonymized(
          model[2].anonymized!,
          model[2].anonymizationOptions!,
        ),
      });
    } else {
      const dataSource = getDataSourceFromId(model[0].dataSourceId!)!;
      const attributeProcedureReference = dataSource.attributes.find(
        (attribute) => attribute.code === "PROCEDURE_REFERENCE",
      )?.code;

      const baseCodes = new Map<string, string[]>();
      const attributeCodes = getAttributesFromKeys(
        [
          ...model[2].selectedAttributeKeys!,
          attributeProcedureReference,
        ].filter(isDefined),
        dataSource,
      ).reduce(
        (acc, it) => {
          // We have to tie the base attributes back together
          if (baseCodes.has(it.code)) {
            baseCodes.get(it.code)!.push(it.baseCode!);
            return acc;
          }

          if (isDefined(it.baseCode)) {
            baseCodes.set(it.code, [it.baseCode]);
          }

          acc.push({
            code: it.code,
            baseAttributeCodes: baseCodes.get(it.code),
          });

          return acc;
        },
        [] as { code: string; baseAttributeCodes?: string[] }[],
      );

      await addEvaluation({
        type: "AddEvaluationWithDataSourcesRequest",
        name: model[3].evaluationName.trim(),
        dataSources: [
          {
            businessModuleName: dataSource.businessModule,
            attributeCodes,
            id: dataSource.id,
          },
        ],
        timeRangeStart: parseISO(model[1].timeSpan!.start),
        timeRangeEnd: parseISO(model[1].timeSpan!.end),
        anonymized: willBeAnonymized(
          model[1].anonymized!,
          dataSource.anonymizationOptions,
        ),
      });
    }
  }

  return (
    <SidebarStepper
      formRef={formRef}
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
            const initialTimeSpan = getLastXMonthsTimeRange(3);
            return {
              title: "Datenquelle konfigurieren",
              content: createStepContent({
                component: ConfigureDataSourceStep,
                componentProps: {
                  isEvaluationTemplateBranch: false,
                  dataSource,
                  explicitStartAndEnd:
                    isDefined(prevStepsValues[1]) &&
                    !isEqualTimeSpan(
                      prevStepsValues[1].timeSpan!,
                      initialTimeSpan,
                    ),
                },
              }),
              initialValues: {
                timeSpan: initialTimeSpan,
                anonymized: (dataSource?.anonymizationOptions !==
                "NOT_ANONYMIZABLE"
                  ? ENUM_TRUE_VALUE
                  : ENUM_FALSE_VALUE) as AnonymizedFieldValue,
              },
              validator: validateConfigureDataSourceStep,
            };
          }
        },
        (prevStepsValues) => {
          if (prevStepsValues[0].dataSourceId === CHOOSE_EVALUATION_TEMPLATE) {
            const initialTimeSpan = getLastXMonthsTimeRange(3);
            return {
              title: "Datenquelle konfigurieren",
              content: createStepContent({
                component: ConfigureDataSourceStep,
                componentProps: {
                  isEvaluationTemplateBranch: true,
                  dataSource: undefined,
                  evaluationTemplateId: prevStepsValues[1].evaluationTemplateId,
                  explicitStartAndEnd:
                    isDefined(prevStepsValues[2]) &&
                    !isEqualTimeSpan(
                      prevStepsValues[2].timeSpan!,
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
                  anonymized: prevStepsValues[1].anonymized!,
                },
              }),
              initialValues: {
                selectedAttributeKeys: [],
                _amountSelectedQuasiIdentifyingAttributes: 0,
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
          const configureDataSourceStep = (
            isEvaluationTemplateBranch ? prevStepsValues[2] : prevStepsValues[1]
          ) as ConfigureDataSourceStepFormModel;
          return {
            title: "Zusammenfassung",
            content: createStepContent({
              component: SummaryStep,
              componentProps: {
                isEvaluationTemplateBranch,
                timeSpan: configureDataSourceStep.timeSpan!,
                anonymized: configureDataSourceStep.anonymized!,
                dataSource: dataSource,
                selectedAttributes: !isEvaluationTemplateBranch
                  ? getAttributesFromKeys(
                      prevStepsValues[2].selectedAttributeKeys!,
                      dataSource!,
                    )
                  : undefined,
                evaluationTemplateId: prevStepsValues[1].evaluationTemplateId,
              },
            }),
            initialValues: { evaluationName: "" },
          };
        },
      ]}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
