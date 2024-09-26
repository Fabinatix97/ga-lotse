/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useAddReport } from "@/lib/businessModules/statistics/api/mutations/useAddReport";
import { SaveReportStep } from "@/lib/businessModules/statistics/components/statistics/details/reports/AddReportSidebar/SaveReportStep";
import { AddReportFormModel } from "@/lib/businessModules/statistics/components/statistics/details/reports/AddReportSidebar/addReportFormModel";
import { getLastXMonthsTimeRange } from "@/lib/businessModules/statistics/components/statistics/timeRangeHelper";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";

export function AddReportSidebar({
  onClose,
  statisticId,
}: {
  onClose: () => void;
  statisticId: string;
}) {
  const initialValues: AddReportFormModel = {
    name: "",
    description: "",
    timeSpan: getLastXMonthsTimeRange(3),
  };

  const addReport = useAddReport(onClose);

  return (
    <SidebarStepper
      onClose={onClose}
      open={true}
      onSubmit={(model) => addReport(statisticId, model)}
      initialValues={initialValues}
      saveLabel="Erstellen"
      steps={[
        {
          type: "StandardStep",
          step: {
            title: "Report erstellen",
            content: <SaveReportStep />,
          },
        },
      ]}
    />
  );
}
