/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfigureScatterChartMetaOptions } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureScatterChartStep/ConfigureScatterChartMetaOptions";
import { ScatterChartMetaFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

import { UpdateAnalysisStep, UpdateNameStepFormModel } from "./UpdateNameStep";

export function UpdateScatterChartStep(
  props: SidebarStepContentProps<
    ScatterChartMetaFormModel & UpdateNameStepFormModel
  >,
) {
  return (
    <UpdateAnalysisStep values={props.values} fieldName={props.fieldName}>
      <ConfigureScatterChartMetaOptions
        values={props.values}
        fieldName={props.fieldName}
      />
    </UpdateAnalysisStep>
  );
}
