/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";
import { isNonNullish } from "remeda";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { ConfigureChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { mapAttributeToAutocompleteSelectionOption } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/mapAttribute";
import {
  groupingValueNames,
  isBooleanOrValueWithOptions,
  orientationValueNames,
  scalingValueNames,
} from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { AutocompleteSelectOption } from "@/lib/shared/components/AutocompleteSelectOptions";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { ToggleButtonGroupField } from "@/lib/shared/components/formFields/ToggleButtonGroupField";

export interface ConfigureBarChartStepProps
  extends SidebarStepContentProps<ConfigureChartFormModel> {
  attributes: FlatAttribute[];
}

export function ConfigureBarChartStep({
  attributes,
  fieldName,
  values,
}: ConfigureBarChartStepProps) {
  const showGroupedConfigurations =
    isNonNullish(values.secondaryAttribute) &&
    values.secondaryAttribute.length > 0;
  const autocompleteSelectOptions: AutocompleteSelectOption[] = attributes.map(
    mapAttributeToAutocompleteSelectionOption((attr) =>
      isBooleanOrValueWithOptions(attr.type),
    ),
  );

  const orientations = buildEnumOptions(orientationValueNames);
  const grouping = buildEnumOptions(groupingValueNames);
  const scaling = buildEnumOptions(scalingValueNames);

  return (
    <Stack gap={3}>
      <Stack gap={2}>
        <SingleAutocompleteField
          options={autocompleteSelectOptions}
          name={fieldName("primaryAttribute")}
          placeholder="Bitte wählen"
          label="Primäres Attribut"
          required="Bitte wählen Sie ein Attribut aus."
        />
        <SingleAutocompleteField
          options={autocompleteSelectOptions}
          name={fieldName("secondaryAttribute")}
          placeholder="Optional"
          label="Sekundäres Attribut"
        />
      </Stack>
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
