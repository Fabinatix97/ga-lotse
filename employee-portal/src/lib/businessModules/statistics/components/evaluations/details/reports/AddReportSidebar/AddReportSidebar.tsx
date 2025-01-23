/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useAddReport } from "@/lib/businessModules/statistics/api/mutations/useAddReport";
import { SaveReportStep } from "@/lib/businessModules/statistics/components/evaluations/details/reports/AddReportSidebar/SaveReportStep";
import { AddReportFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/reports/AddReportSidebar/addReportFormModel";
import { getLastXMonthsTimeRange } from "@/lib/businessModules/statistics/components/evaluations/timeRangeHelper";
import {
  SidebarStepper,
  createStepContent,
} from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useAddReportSidebar(): UseSidebarWithFormRefResult<AddReportSidebarProps> {
  return useSidebarWithFormRef({
    component: AddReportSidebar,
  });
}

interface AddReportSidebarProps extends SidebarWithFormRefProps {
  evaluationId: string;
}

function AddReportSidebar({
  onClose,
  evaluationId,
  formRef,
}: AddReportSidebarProps) {
  const initialValues: AddReportFormModel = {
    name: "",
    description: "",
    timeSpan: getLastXMonthsTimeRange(3),
  };

  const addReport = useAddReport(() => onClose(true));

  return (
    <SidebarStepper
      onClose={onClose}
      formRef={formRef}
      saveLabel="Erstellen"
      onSubmit={(model) => addReport(evaluationId, model[0])}
      steps={[
        () => ({
          title: "Report erstellen",
          content: createStepContent({
            component: SaveReportStep,
          }),
          initialValues,
        }),
      ]}
    />
  );
}
