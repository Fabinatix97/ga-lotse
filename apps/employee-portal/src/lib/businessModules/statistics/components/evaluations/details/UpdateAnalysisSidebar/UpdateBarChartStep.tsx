/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfigureBarChartMetaOptions } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureBarChartStep/ConfigureBarChartMetaOptions";
import { BarChartMetaFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

import { UpdateAnalysisStep, UpdateNameStepFormModel } from "./UpdateNameStep";

type UpdateBarChartStepProps = SidebarStepContentProps<
  BarChartMetaFormModel & UpdateNameStepFormModel
> & {
  showGroupedConfigurations: boolean;
};

export function UpdateBarChartStep(props: UpdateBarChartStepProps) {
  return (
    <UpdateAnalysisStep values={props.values} fieldName={props.fieldName}>
      <ConfigureBarChartMetaOptions
        showGroupedConfigurations={props.showGroupedConfigurations}
        values={props.values}
        fieldName={props.fieldName}
      />
    </UpdateAnalysisStep>
  );
}
