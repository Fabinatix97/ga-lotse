/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { ConfigureChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { mapAttributeToAutocompleteSelectionOption } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/mapAttribute";
import {
  axisRangeValueNames,
  isBooleanOrValueWithOptions,
  isNumeric,
} from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { ToggleButtonGroupField } from "@/lib/shared/components/formFields/ToggleButtonGroupField";

export interface ConfigureLineChartStepProps
  extends SidebarStepContentProps<ConfigureChartFormModel> {
  attributes: FlatAttribute[];
}

export function ConfigureLineChartStep({
  attributes,
  fieldName,
}: ConfigureLineChartStepProps) {
  const axisAttributes = attributes.map(
    mapAttributeToAutocompleteSelectionOption((attribute) =>
      isNumeric(attribute.type),
    ),
  );
  const secondaryAttributes = attributes.map(
    mapAttributeToAutocompleteSelectionOption((attribute) =>
      isBooleanOrValueWithOptions(attribute.type),
    ),
  );
  const axisRange = buildEnumOptions(axisRangeValueNames);

  return (
    <Stack gap={3}>
      <Stack gap={2}>
        <SingleAutocompleteField
          options={axisAttributes}
          name={fieldName("xAxis")}
          placeholder="Bitte wählen"
          label="X-Achse"
          required="Bitte wählen Sie ein Attribut aus."
        />
        <SingleAutocompleteField
          options={axisAttributes}
          name={fieldName("yAxis")}
          placeholder="Bitte wählen"
          label="Y-Achse"
          required="Bitte wählen Sie ein Attribut aus."
        />
        <SingleAutocompleteField
          options={secondaryAttributes}
          name={fieldName("secondaryAttribute")}
          placeholder="Optional"
          label="Sekundäres Attribut"
        />
      </Stack>
      <ToggleButtonGroupField
        options={axisRange}
        name={fieldName("axisRange")}
        label="Achsenskalierung"
      />
    </Stack>
  );
}
