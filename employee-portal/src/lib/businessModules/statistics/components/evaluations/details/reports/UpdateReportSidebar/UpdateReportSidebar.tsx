/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReportDataType } from "@/lib/businessModules/statistics/api/models/evaluationReports";
import { useUpdateReport } from "@/lib/businessModules/statistics/api/mutations/useUpdateReport";
import { UpdateReportStep } from "@/lib/businessModules/statistics/components/evaluations/details/reports/UpdateReportSidebar/UpdateReportStep";
import { UpdateReportFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/reports/UpdateReportSidebar/updateReportFormModel";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useUpdateReportSidebar(): UseSidebarWithFormRefResult<UpdateReportSidebarProps> {
  return useSidebarWithFormRef({
    component: UpdateReportSidebar,
  });
}

export interface UpdateReportSidebarReportInfo {
  seriesId: string;
  name: string;
  description?: string;
  type: ReportDataType;
}

interface UpdateReportSidebarProps extends SidebarWithFormRefProps {
  report: UpdateReportSidebarReportInfo;
}

function UpdateReportSidebar({
  onClose,
  report,
  formRef,
}: UpdateReportSidebarProps) {
  const updateReport = useUpdateReport(() => onClose(true));

  async function onSubmit(model: UpdateReportFormModel) {
    return updateReport(report.seriesId, model);
  }

  const initialValues = {
    name: report.name,
    description: report.description ?? "",
  };

  return (
    <SidebarStepper
      onClose={onClose}
      onSubmit={onSubmit}
      initialValues={initialValues}
      formRef={formRef}
      steps={[
        {
          type: "StandardStep",
          step: {
            title:
              report.type === ReportDataType.Series
                ? "Serie bearbeiten"
                : "Report bearbeiten",
            content: <UpdateReportStep />,
          },
        },
      ]}
    />
  );
}
