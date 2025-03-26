/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfigureLineChartMetaOptions } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureLineChartStep/ConfigureLineChartMetaOptions";
import { LineChartMetaFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

import { UpdateAnalysisStep, UpdateNameStepFormModel } from "./UpdateNameStep";

export function UpdateLineChartStep(
  props: SidebarStepContentProps<
    LineChartMetaFormModel & UpdateNameStepFormModel
  >,
) {
  return (
    <UpdateAnalysisStep values={props.values} fieldName={props.fieldName}>
      <ConfigureLineChartMetaOptions
        values={props.values}
        fieldName={props.fieldName}
      />
    </UpdateAnalysisStep>
  );
}
