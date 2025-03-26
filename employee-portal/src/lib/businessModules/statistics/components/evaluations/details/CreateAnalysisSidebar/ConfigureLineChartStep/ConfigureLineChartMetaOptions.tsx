/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import { LineChartMetaFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { axisRangeValueNames } from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { ToggleButtonGroupField } from "@/lib/shared/components/formFields/ToggleButtonGroupField";

export function ConfigureLineChartMetaOptions({
  fieldName,
}: SidebarStepContentProps<LineChartMetaFormModel>) {
  const axisRange = buildEnumOptions(axisRangeValueNames);

  return (
    <ToggleButtonGroupField
      options={axisRange}
      name={fieldName("axisRange")}
      label="Achsenskalierung"
    />
  );
}
