/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import {
  buildEnumOptions,
  createFieldNameMapper,
} from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";

import { DiagramBinning } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { ConfigureHistogramChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureHistogramChartStep/configureHistogramChartFormModel";
import { mapAttributeToAutocompleteSelectionOption } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/mapAttribute";
import {
  binningValueNames,
  groupingValueNames,
  isBooleanOrValueWithOptions,
  isNumericOrDate,
  scalingValueNames,
} from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { AutocompleteSelectOption } from "@/lib/shared/components/AutocompleteSelectOptions";
import { SliderField } from "@/lib/shared/components/formFields/SliderField";
import { ToggleButtonGroupField } from "@/lib/shared/components/formFields/ToggleButtonGroupField";

export function ConfigureHistogramChartStep({
  attributes,
}: {
  attributes: FlatAttribute[];
}) {
  const fieldName = createFieldNameMapper<ConfigureHistogramChartFormModel>(
    "configureHistogramChartFormModel",
  );
  const { getFieldProps } = useFormikContext();
  const secondaryAttributeFieldValue = getFieldProps<string>(
    fieldName("secondaryAttribute"),
  ).value;
  const binningFieldValue = getFieldProps<DiagramBinning>(
    fieldName("binning"),
  ).value;
  const showGroupedConfigurations = secondaryAttributeFieldValue?.length > 0;
  const showBins = binningFieldValue === "MANUAL";

  const primaryAutocompleteSelectOptions: AutocompleteSelectOption[] =
    attributes.map(
      mapAttributeToAutocompleteSelectionOption((attr) =>
        isNumericOrDate(attr.type),
      ),
    );
  const secondaryAutocompleteSelectOptions: AutocompleteSelectOption[] =
    attributes.map(
      mapAttributeToAutocompleteSelectionOption((attr) =>
        isBooleanOrValueWithOptions(attr.type),
      ),
    );

  const grouping = buildEnumOptions(groupingValueNames);
  const scaling = buildEnumOptions(scalingValueNames);
  const binning = buildEnumOptions(binningValueNames);

  return (
    <Stack gap={3}>
      <Stack gap={2}>
        <SingleAutocompleteField
          options={primaryAutocompleteSelectOptions}
          name={fieldName("primaryAttribute")}
          placeholder="Bitte wählen"
          label="Primäres Attribut"
          required="Bitte wählen Sie ein Attribut aus."
        />
        <SingleAutocompleteField
          options={secondaryAutocompleteSelectOptions}
          name={fieldName("secondaryAttribute")}
          placeholder="Optional"
          label="Sekundäres Attribut"
        />
      </Stack>
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
      <Stack gap={1}>
        <ToggleButtonGroupField
          options={binning}
          name={fieldName("binning")}
          label="Bins"
        />
        {showBins && (
          <SliderField
            min={1}
            max={50}
            name={fieldName("bins")}
            ariaLabel="Anzahl Bins"
          />
        )}
      </Stack>
    </Stack>
  );
}
