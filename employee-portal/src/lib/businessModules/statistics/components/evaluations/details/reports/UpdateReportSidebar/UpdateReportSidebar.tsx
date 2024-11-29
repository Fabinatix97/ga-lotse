/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReportDataType } from "@/lib/businessModules/statistics/api/models/evaluationReports";
import { useUpdateReport } from "@/lib/businessModules/statistics/api/mutations/useUpdateReport";
import { UpdateReportStep } from "@/lib/businessModules/statistics/components/evaluations/details/reports/UpdateReportSidebar/UpdateReportStep";
import { UpdateReportFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/reports/UpdateReportSidebar/updateReportFormModel";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";

export interface UpdateReportSidebarReportInfo {
  seriesId: string;
  name: string;
  description?: string;
  type: ReportDataType;
}
export interface UpdateReportSidebarProps {
  onClose: () => void;
  report: UpdateReportSidebarReportInfo;
}

export function UpdateReportSidebar({
  onClose,
  report,
}: UpdateReportSidebarProps) {
  const updateReport = useUpdateReport(onClose);

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
      open={true}
      onSubmit={onSubmit}
      initialValues={initialValues}
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
