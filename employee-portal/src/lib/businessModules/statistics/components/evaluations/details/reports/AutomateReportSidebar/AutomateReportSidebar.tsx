/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Interval,
  ReportingPeriod,
} from "@/lib/businessModules/statistics/api/models/reportSeriesTypes";
import { useAddAutoReportSeries } from "@/lib/businessModules/statistics/api/mutations/useAddAutoReportSeries";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

import { AutomateReportStep } from "./AutomateReportStep";
import {
  AutomateReportFormModel,
  getFirstPossibleStartMonth,
} from "./automateReportFormModel";

export function useAutomateReportSidebar(): UseSidebarWithFormRefResult<AutomateReportSidebarProps> {
  return useSidebarWithFormRef({
    component: AutomateReportSidebar,
  });
}

interface AutomateReportSidebarProps extends SidebarWithFormRefProps {
  evaluationId: string;
}

function AutomateReportSidebar({
  onClose,
  evaluationId,
  formRef,
}: AutomateReportSidebarProps) {
  const initialValues: AutomateReportFormModel = {
    name: "",
    description: "",
    interval: Interval.ThreeMonths,
    startMonth: getFirstPossibleStartMonth(),
    reportingPeriod: ReportingPeriod.ThreeMonths,
  };

  const addAutoReportSeries = useAddAutoReportSeries(() => onClose(true));

  return (
    <SidebarStepper
      onClose={onClose}
      onSubmit={(model) => addAutoReportSeries(evaluationId, model)}
      initialValues={initialValues}
      formRef={formRef}
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
