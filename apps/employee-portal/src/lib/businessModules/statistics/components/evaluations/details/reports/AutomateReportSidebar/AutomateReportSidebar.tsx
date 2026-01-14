/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import {
  Interval,
  ReportingPeriod,
} from "@/lib/businessModules/statistics/api/models/reportSeriesTypes";
import { useAddAutoReportSeries } from "@/lib/businessModules/statistics/api/mutations/useAddAutoReportSeries";
import {
  SidebarStepper,
  createStepContent,
} from "@/lib/shared/components/SidebarStepper/SidebarStepper";

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
      formRef={formRef}
      saveLabel="Speichern"
      steps={[
        () => ({
          title: "Report automatisieren",
          content: createStepContent({
            component: AutomateReportStep,
          }),
          initialValues,
        }),
      ]}
      onClose={onClose}
      onSubmit={(model) => addAutoReportSeries(evaluationId, model[0])}
    />
  );
}
