/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import { BarChartMetaFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import {
  groupingValueNames,
  orientationValueNames,
  scalingValueNames,
} from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { ToggleButtonGroupField } from "@/lib/shared/components/formFields/ToggleButtonGroupField";

interface ConfigureBarChartMetaOptionsProps
  extends SidebarStepContentProps<BarChartMetaFormModel> {
  showGroupedConfigurations: boolean;
}

export function ConfigureBarChartMetaOptions({
  fieldName,
  showGroupedConfigurations,
}: ConfigureBarChartMetaOptionsProps) {
  const orientations = buildEnumOptions(orientationValueNames);
  const grouping = buildEnumOptions(groupingValueNames);
  const scaling = buildEnumOptions(scalingValueNames);

  return (
    <Stack gap={3}>
      <ToggleButtonGroupField
        options={orientations}
        name={fieldName("orientation")}
        label="Ausrichtung"
      />
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
