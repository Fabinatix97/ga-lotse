/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { isNonNullish } from "remeda";

import { SingleAutocompleteField, buildEnumOptions } from "@eshg/lib-portal";
import { ApiCalculation } from "@eshg/statistics-api";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { GeoShapeInfo } from "@/lib/businessModules/statistics/api/models/geoShapesTableView";
import { continentsGeoJSON } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar//worldContinentsGeoJSON";
import {
  ChartsSamplePreview,
  choroplethAverageLandArea,
  choroplethCountryCount,
  choroplethLandArea,
} from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ChartsSamplePreview";
import { ConfigureChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { mapAttributeToAutocompleteSelectionOption } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/mapAttribute";
import { ChoroplethMap } from "@/lib/businessModules/statistics/components/shared/charts/ChoroplethMap";
import {
  choroplethAggregationMethodValueNames,
  isBoolean,
  isNumeric,
  isText,
  isValueWithOptions,
} from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { AutocompleteSelectOption } from "@/lib/shared/components/AutocompleteSelectOptions";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { ToggleButtonGroupField } from "@/lib/shared/components/formFields/ToggleButtonGroupField";

import { ConfigureChoroplethChartMetaOptions } from "./ConfigureChoroplethChartMetaOptions";

interface ConfigureChoroplethChartStepProps
  extends SidebarStepContentProps<ConfigureChartFormModel> {
  attributes: FlatAttribute[];
  choroplethMaps: GeoShapeInfo[];
}

export function ConfigureChoroplethChartStep({
  attributes,
  choroplethMaps,
  fieldName,
  values,
}: ConfigureChoroplethChartStepProps) {
  const primaryAttributeSelectOptions: AutocompleteSelectOption[] =
    attributes.map(
      mapAttributeToAutocompleteSelectionOption(
        (attr) => isValueWithOptions(attr.type) || isText(attr.type),
      ),
    );
  const secondaryAttributeSelectOptions: AutocompleteSelectOption[] =
    attributes.map(
      mapAttributeToAutocompleteSelectionOption(
        (attr) => isNumeric(attr.type) || isBoolean(attr.type),
      ),
    );
  const showGroupedConfigurations =
    isNonNullish(values.secondaryAttribute) &&
    values.secondaryAttribute.length > 0;

  const aggregationMethods = buildEnumOptions(
    choroplethAggregationMethodValueNames,
  );

  const districtOptions = choroplethMaps.map((it) => ({
    label: it.title,
    value: it.id,
  }));

  const hasSecondAttribute =
    isNonNullish(values.secondaryAttribute) && values.secondaryAttribute !== "";

  return (
    <Stack gap={4}>
      <Stack gap={3}>
        <SingleAutocompleteField
          options={primaryAttributeSelectOptions}
          name={fieldName("geoReferencedAttribute")}
          placeholder="Bitte wählen"
          label="Georeferenziertes Attribut"
          required="Bitte wählen Sie ein Attribut aus."
        />
        <SingleAutocompleteField
          options={secondaryAttributeSelectOptions}
          name={fieldName("secondaryAttribute")}
          placeholder="Optional"
          label="Sekundäres Attribut"
        />
        {showGroupedConfigurations && (
          <ToggleButtonGroupField
            options={aggregationMethods}
            name={fieldName("characteristicParameter")}
            label="Darstellung"
          />
        )}
        <ConfigureChoroplethChartMetaOptions
          fieldName={fieldName}
          values={values}
        />
        <SingleAutocompleteField
          options={districtOptions}
          name={fieldName("geoShapeId")}
          placeholder="Bitte wählen"
          label="Karte"
          required="Bitte wählen Sie eine Karte aus."
        />
      </Stack>
      <ChartsSamplePreview
        chart={
          <ChoroplethMap
            diagramData={
              hasSecondAttribute
                ? values.characteristicParameter === ApiCalculation.Mean
                  ? choroplethAverageLandArea
                  : choroplethLandArea
                : choroplethCountryCount
            }
            colorScheme={values.colorScheme}
            characteristicParameter={
              hasSecondAttribute ? values.characteristicParameter : undefined
            }
            geoJson={continentsGeoJSON}
            additionalEchartsSeriesOptions={{
              roam: false, // disable zoom
              layoutCenter: ["40%", "50%"],
              layoutSize: 350, // avoid overlapping with visualMap
              aspectScale: 1,
            }}
          />
        }
      />
    </Stack>
  );
}
