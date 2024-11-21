/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Interval,
  ReportingPeriod,
} from "@/lib/businessModules/statistics/api/models/reportSeriesTypes";
import { useAddAutoReportSeries } from "@/lib/businessModules/statistics/api/mutations/useAddAutoReportSeries";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";

import { AutomateReportStep } from "./AutomateReportStep";
import {
  AutomateReportFormModel,
  getFirstPossibleStartMonth,
} from "./automateReportFormModel";

export function AutomateReportSidebar({
  onClose,
  statisticId,
}: {
  onClose: () => void;
  statisticId: string;
}) {
  const initialValues: AutomateReportFormModel = {
    name: "",
    description: "",
    interval: Interval.ThreeMonths,
    startMonth: getFirstPossibleStartMonth(),
    reportingPeriod: ReportingPeriod.ThreeMonths,
  };

  const addAutoReportSeries = useAddAutoReportSeries(onClose);

  return (
    <SidebarStepper
      onClose={onClose}
      open={true}
      onSubmit={(model) => addAutoReportSeries(statisticId, model)}
      initialValues={initialValues}
      saveLabel="Speichern"
      steps={[
        {
          type: "StandardStep",
          step: {
            title: "Report automatisieren",
            content: <AutomateReportStep />,
          },
        },
      ]}
    />
  );
}
