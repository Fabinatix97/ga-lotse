/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { parseISO } from "date-fns";
import { groupBy, isDefined } from "remeda";

import { useAddStatistic } from "@/lib/businessModules/statistics/api/mutations/useAddStatistic";
import {
  ChooseTemplateStep,
  Scheme,
} from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseTemplateStep/ChooseTemplateStep";
import { validateChooseTemplateStep } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/ChooseTemplateStep/validateChooseTemplateStep";
import { SaveStatisticStep } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/SaveStatisticStep/SaveStatisticStep";
import { validateSaveStatisticStep } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/SaveStatisticStep/validateSaveStatisticStep";
import { CreateStatisticFromTemplateFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/createStatisticFromTemplateFormModel";
import { getLastXMonthsTimeRange } from "@/lib/businessModules/statistics/components/statistics/timeRangeHelper";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";

export function CreateStatisticFromTemplateSidebar({
  open,
  onClose,
  schemes,
  viewCreateStatistics,
}: {
  open: boolean;
  onClose: () => void;
  schemes: Scheme[];
  viewCreateStatistics: () => void;
}) {
  const initialValues: CreateStatisticFromTemplateFormModel = {
    schemeName: "",
    statisticName: "",
    timeSpan: getLastXMonthsTimeRange(3),
  };
  const addStatistic = useAddStatistic({
    onSuccess: onClose,
  });

  async function onSubmit(model: CreateStatisticFromTemplateFormModel) {
    if (!model.scheme?.dataSource) {
      throw new Error();
    }

    const attributeGroups = groupBy(
      model.scheme.dataSource.attributes,
      (item) => item.code,
    );

    await addStatistic({
      type: "AddStatisticWithDataSourcesRequest",
      name: model.statisticName.trim(),
      dataSources: [
        {
          businessModuleName: model.scheme.dataSource.businessModule,
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
          id: model.scheme.dataSource.id,
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
        _schemeId: null,
      }}
      steps={[
        {
          type: "StandardStep",
          step: {
            title: "Vorlagen",
            content: (
              <ChooseTemplateStep
                schemes={schemes}
                viewCreateStatistics={viewCreateStatistics}
              />
            ),
            validator: validateChooseTemplateStep,
            disableContinue: schemes.length === 0,
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
