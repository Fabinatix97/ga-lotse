/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { buildEnumOptions } from "@eshg/lib-portal";

import { ScatterChartMetaFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { axisRangeValueNames } from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { SwitchField } from "@/lib/shared/components/formFields/SwitchField";
import { ToggleButtonGroupField } from "@/lib/shared/components/formFields/ToggleButtonGroupField";

export function ConfigureScatterChartMetaOptions({
  fieldName,
}: SidebarStepContentProps<ScatterChartMetaFormModel>) {
  const axisRange = buildEnumOptions(axisRangeValueNames);

  return (
    <Stack gap={3}>
      <ToggleButtonGroupField
        options={axisRange}
        name={fieldName("axisRange")}
        label="Achsenskalierung"
      />
      <SwitchField name={fieldName("trendline")} label="Trendlinie" />
    </Stack>
  );
}
