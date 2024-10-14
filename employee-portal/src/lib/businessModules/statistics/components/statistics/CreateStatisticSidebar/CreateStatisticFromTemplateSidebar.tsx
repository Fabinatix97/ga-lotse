/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { parseISO } from "date-fns";

import { useAddStatistic } from "@/lib/businessModules/statistics/api/mutations/useAddStatistic";
import {
  ChooseTemplateStep,
  Template,
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
  templates,
  viewCreateStatistics,
}: {
  open: boolean;
  onClose: () => void;
  templates: Template[];
  viewCreateStatistics: () => void;
}) {
  const initialValues: CreateStatisticFromTemplateFormModel = {
    templateName: "",
    statisticName: "",
    timeSpan: getLastXMonthsTimeRange(3),
  };
  const addStatistic = useAddStatistic({
    onSuccess: onClose,
  });

  async function onSubmit(model: CreateStatisticFromTemplateFormModel) {
    if (!model.template?.id) {
      throw new Error();
    }

    await addStatistic({
      type: "AddStatisticWithTemplateRequest",
      name: model.statisticName.trim(),
      timeRangeStart: parseISO(model.timeSpan.start),
      timeRangeEnd: parseISO(model.timeSpan.end),
      templateId: model.template.id,
    });
  }

  return (
    <SidebarStepper
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      initialValues={{
        ...initialValues,
        _templateId: null,
      }}
      steps={[
        {
          type: "StandardStep",
          step: {
            title: "Vorlagen",
            content: (
              <ChooseTemplateStep
                templates={templates}
                viewCreateStatistics={viewCreateStatistics}
              />
            ),
            validator: validateChooseTemplateStep,
            disableContinue: templates.length === 0,
          },
        },
        {
          type: "StandardStep",
          step: {
            title: "Auswertung speichern",
            content: <SaveStatisticStep />,
            validator: validateSaveStatisticStep,
          },
        },
      ]}
    />
  );
}
