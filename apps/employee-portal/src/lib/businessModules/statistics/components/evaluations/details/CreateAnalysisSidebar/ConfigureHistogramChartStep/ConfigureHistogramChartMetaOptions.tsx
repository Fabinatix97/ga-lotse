/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { buildEnumOptions } from "@eshg/lib-portal";

import { HistogramChartMetaFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import {
  groupingValueNames,
  scalingValueNames,
} from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { ToggleButtonGroupField } from "@/lib/shared/components/formFields/ToggleButtonGroupField";

interface ConfigureHistogramChartMetaOptionsProps
  extends SidebarStepContentProps<HistogramChartMetaFormModel> {
  showGroupedConfigurations: boolean;
}

export function ConfigureHistogramChartMetaOptions({
  fieldName,
  showGroupedConfigurations,
}: ConfigureHistogramChartMetaOptionsProps) {
  const grouping = buildEnumOptions(groupingValueNames);
  const scaling = buildEnumOptions(scalingValueNames);

  return (
    <Stack gap={3}>
      {showGroupedConfigurations && (
        <>
          <ToggleButtonGroupField
            options={grouping}
            name={fieldName("grouping")}
            label="Anordnung"
          />
          <ToggleButtonGroupField
            options={scaling}
            name={fieldName("scaling")}
            label="Verhältnisse"
          />
        </>
      )}
    </Stack>
  );
}
