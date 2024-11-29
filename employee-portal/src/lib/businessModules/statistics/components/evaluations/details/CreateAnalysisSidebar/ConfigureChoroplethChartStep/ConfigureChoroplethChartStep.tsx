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

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { GeoShapeInfo } from "@/lib/businessModules/statistics/api/models/geoShapesTableView";
import { ConfigureChoroplethChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureChoroplethChartStep/configureChoroplethChartFormModel";
import { mapAttributeToAutocompleteSelectionOption } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/mapAttribute";
import {
  choroplethAggregationMethodValueNames,
  colorSchemeNames,
  isBoolean,
  isNumeric,
  isText,
  isValueWithOptions,
} from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { AutocompleteSelectOption } from "@/lib/shared/components/AutocompleteSelectOptions";
import { ToggleButtonGroupField } from "@/lib/shared/components/formFields/ToggleButtonGroupField";

export function ConfigureChoroplethChartStep({
  attributes,
  choroplethMaps,
}: {
  attributes: FlatAttribute[];
  choroplethMaps: GeoShapeInfo[];
}) {
  const fieldName = createFieldNameMapper<ConfigureChoroplethChartFormModel>(
    "configureChoroplethChartFormModel",
  );
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
  const { getFieldProps } = useFormikContext();
  const fieldValue = getFieldProps<string>(
    fieldName("secondaryAttributeSelectionKey"),
  ).value;
  const showGroupedConfigurations = fieldValue?.length > 0;

  const aggregationMethods = buildEnumOptions(
    choroplethAggregationMethodValueNames,
  );
  const colorSchemes = buildEnumOptions(colorSchemeNames);

  const districtOptions = choroplethMaps.map((it) => ({
    label: it.title,
    value: it.id,
  }));

  return (
    <Stack gap={3}>
      <SingleAutocompleteField
        options={primaryAttributeSelectOptions}
        name={fieldName("geoReferencedAttributeKey")}
        placeholder="Bitte wählen"
        label="Georeferenziertes Attribut"
        required="Bitte wählen Sie ein Attribut aus."
      />
      <SingleAutocompleteField
        options={secondaryAttributeSelectOptions}
        name={fieldName("secondaryAttributeSelectionKey")}
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
      <SingleAutocompleteField
        options={colorSchemes}
        name={fieldName("colorScheme")}
        placeholder="Bitte wählen"
        label="Farbschema"
        required="Bitte wählen Sie ein Farbschema aus."
      />
      <SingleAutocompleteField
        options={districtOptions}
        name={fieldName("geoShapeId")}
        placeholder="Bitte wählen"
        label="Karte"
        required="Bitte wählen Sie eine Karte aus."
      />
    </Stack>
  );
}
