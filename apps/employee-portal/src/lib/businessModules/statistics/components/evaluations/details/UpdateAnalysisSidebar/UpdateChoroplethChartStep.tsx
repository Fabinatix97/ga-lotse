/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfigureChoroplethChartMetaOptions } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureChoroplethChartStep/ConfigureChoroplethChartMetaOptions";
import { ChoroplethChartMetaFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

import { UpdateAnalysisStep, UpdateNameStepFormModel } from "./UpdateNameStep";

export function UpdateChoroplethChartStep(
  props: SidebarStepContentProps<
    ChoroplethChartMetaFormModel & UpdateNameStepFormModel
  >,
) {
  return (
    <UpdateAnalysisStep values={props.values} fieldName={props.fieldName}>
      <ConfigureChoroplethChartMetaOptions
        values={props.values}
        fieldName={props.fieldName}
      />
    </UpdateAnalysisStep>
  );
}
