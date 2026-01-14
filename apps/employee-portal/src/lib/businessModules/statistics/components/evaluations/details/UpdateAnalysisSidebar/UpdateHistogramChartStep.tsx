/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfigureHistogramChartMetaOptions } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureHistogramChartStep/ConfigureHistogramChartMetaOptions";
import { HistogramChartMetaFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

import { UpdateAnalysisStep, UpdateNameStepFormModel } from "./UpdateNameStep";

type UpdateHistogramChartStepProps = SidebarStepContentProps<
  HistogramChartMetaFormModel & UpdateNameStepFormModel
> & {
  showGroupedConfigurations: boolean;
};

export function UpdateHistogramChartStep(props: UpdateHistogramChartStepProps) {
  return (
    <UpdateAnalysisStep values={props.values} fieldName={props.fieldName}>
      <ConfigureHistogramChartMetaOptions
        showGroupedConfigurations={props.showGroupedConfigurations}
        values={props.values}
        fieldName={props.fieldName}
      />
    </UpdateAnalysisStep>
  );
}
