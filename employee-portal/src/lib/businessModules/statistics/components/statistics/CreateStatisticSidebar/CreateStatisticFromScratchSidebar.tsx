/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { parseISO } from "date-fns";
import { groupBy, isDefined } from "remeda";

import { useAddStatistic } from "@/lib/businessModules/statistics/api/mutations/useAddStatistic";
import { SidebarStepper } from "@/lib/businessModules/statistics/components/shared/SidebarStepper/SidebarStepper";
import {
  CategorizedFlatAttribute,
  ChooseAttributesStep,
} from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseAttributesStep/ChooseAttributesStep";
import { validateChooseAttributeStep } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseAttributesStep/validateChooseAttributeStep";
import {
  ChooseDataSourceStep,
  DataSource,
} from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseDataSourceStep/ChooseDataSourceStep";
import { SaveStatisticStep } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/SaveStatisticStep/SaveStatisticStep";
import { validateSaveStatisticStep } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/SaveStatisticStep/validateSaveStatisticStep";
import { CreateStatisticFromScratchFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/createStatisticFromScratchFormModel";
import { getLastXMonthsTimeRange } from "@/lib/businessModules/statistics/components/statistics/timeRangeHelper";

export function CreateStatisticFromScratchSidebar({
  open,
  onClose,
  dataSources,
  attributes,
  viewTemplates,
}: {
  open: boolean;
  onClose: () => void;
  dataSources: DataSource[];
  attributes: CategorizedFlatAttribute[];
  viewTemplates: () => void;
}) {
  const initialValues: CreateStatisticFromScratchFormModel = {
    schemeName: "",
    statisticName: "",
    timeSpan: getLastXMonthsTimeRange(3),
  };
  const addStatistic = useAddStatistic({
    onSuccess: onClose,
  });

  async function onSubmit(model: CreateStatisticFromScratchFormModel) {
    if (!model.selectedAttributes || !model.dataSource) {
      throw new Error();
    }

    const attributeGroups = groupBy(
      model.selectedAttributes,
      (item) => item.code,
    );

    await addStatistic({
      type: "AddStatisticWithDataSourcesRequest",
      name: model.statisticName.trim(),
      dataSources: [
        {
          businessModuleName: model.dataSource.businessModule,
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
          id: model.dataSource.id,
        },
      ],
      timeRangeStart: parseISO(model.timeSpan.start),
      timeRangeEnd: parseISO(model.timeSpan.end),
      schemeName: model.schemeName !== "" ? model.schemeName : undefined,
    });
  }

  return (
    <SidebarStepper
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      initialValues={{
        ...initialValues,
        _dataSourceId: "",
        _selectedAttributeKeys: [],
      }}
      steps={[
        {
          type: "StandardStep",
          step: {
            title: "Neue Statistik erstellen",
            content: (
              <ChooseDataSourceStep
                dataSources={dataSources}
                viewTemplates={viewTemplates}
              />
            ),
          },
        },
        {
          type: "StandardStep",
          step: {
            title: "Attribute wählen",
            content: <ChooseAttributesStep attributes={attributes} />,
            validator: validateChooseAttributeStep,
          },
        },
        {
          type: "StandardStep",
          step: {
            title: "Statistik speichern",
            content: <SaveStatisticStep />,
            validator: validateSaveStatisticStep,
          },
        },
      ]}
    />
  );
}
