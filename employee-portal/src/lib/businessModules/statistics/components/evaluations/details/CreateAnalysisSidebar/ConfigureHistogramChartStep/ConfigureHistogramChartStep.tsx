/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";
import { isDefined, isNonNullish } from "remeda";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import {
  ChartsSamplePreview,
  getHistogramGroupedSampleData,
  getHistogramSimpleSampleData,
} from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ChartsSamplePreview";
import { ConfigureChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { mapAttributeToAutocompleteSelectionOption } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/mapAttribute";
import { Histogram } from "@/lib/businessModules/statistics/components/shared/charts/Histogram";
import {
  binningValueNames,
  groupingValueNames,
  isCategorical,
  isNumeric,
  scalingValueNames,
} from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { AutocompleteSelectOption } from "@/lib/shared/components/AutocompleteSelectOptions";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { SliderField } from "@/lib/shared/components/formFields/SliderField";
import { ToggleButtonGroupField } from "@/lib/shared/components/formFields/ToggleButtonGroupField";

export interface ConfigureHistogramChartStepProps
  extends SidebarStepContentProps<ConfigureChartFormModel> {
  attributes: FlatAttribute[];
}

export function ConfigureHistogramChartStep({
  attributes,
  fieldName,
  values,
}: ConfigureHistogramChartStepProps) {
  const showGroupedConfigurations =
    isNonNullish(values.secondaryAttribute) &&
    values.secondaryAttribute.length > 0;
  const showBins = isDefined(values.binning) && values.binning === "MANUAL";

  const primaryAutocompleteSelectOptions: AutocompleteSelectOption[] =
    attributes.map(
      mapAttributeToAutocompleteSelectionOption((attr) => isNumeric(attr.type)),
    );
  const secondaryAutocompleteSelectOptions: AutocompleteSelectOption[] =
    attributes.map(
      mapAttributeToAutocompleteSelectionOption((attr) =>
        isCategorical(attr.type),
      ),
    );

  const grouping = buildEnumOptions(groupingValueNames);
  const scaling = buildEnumOptions(scalingValueNames);
  const binning = buildEnumOptions(binningValueNames);

  return (
    <Stack gap={4}>
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
            <>
              <SliderField
                min={1}
                max={50}
                name={fieldName("bins")}
                ariaLabel="Anzahl Bins"
              />
              <NumberField
                label="Bin-Zentrum (unten)"
                name={fieldName("minBin")}
                required="Bitte geben Sie einen Wert ein."
              />
              <NumberField
                label="Bin-Zentrum (oben)"
                name={fieldName("maxBin")}
                required="Bitte geben Sie einen Wert ein."
              />
            </>
          )}
        </Stack>
      </Stack>
      <ChartsSamplePreview
        chart={
          showGroupedConfigurations ? (
            <Histogram
              key={"groupedHistogram"}
              diagramData={getHistogramGroupedSampleData(values.bins)}
              grouping={values.grouping}
              scaling={values.scaling}
            />
          ) : (
            <Histogram
              key={"simpleHistogram"}
              diagramData={getHistogramSimpleSampleData(values.bins)}
            />
          )
        }
      />
    </Stack>
  );
}
