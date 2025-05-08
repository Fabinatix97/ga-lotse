/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { isNonNullish } from "remeda";

import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import {
  ChartsSamplePreview,
  barChartGroupedSampleData,
  barChartSimpleSampleData,
} from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ChartsSamplePreview";
import { ConfigureChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { mapAttributeToAutocompleteSelectionOption } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/mapAttribute";
import { BarChart } from "@/lib/businessModules/statistics/components/shared/charts/BarChart";
import { isCategorical } from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { AutocompleteSelectOption } from "@/lib/shared/components/AutocompleteSelectOptions";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

import { ConfigureBarChartMetaOptions } from "./ConfigureBarChartMetaOptions";

interface ConfigureBarChartStepProps
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
      isCategorical(attr.type),
    ),
  );

  return (
    <Stack gap={4}>
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
        <ConfigureBarChartMetaOptions
          showGroupedConfigurations={showGroupedConfigurations}
          fieldName={fieldName}
          values={values}
        />
      </Stack>
      <ChartsSamplePreview
        chart={
          showGroupedConfigurations ? (
            <BarChart
              key="groupedBarChart"
              diagramData={barChartGroupedSampleData}
              isDataGrouped
              orientation={values.orientation}
              grouping={values.grouping}
              scaling={values.scaling}
            />
          ) : (
            <BarChart
              key="simpleBarChart"
              diagramData={barChartSimpleSampleData}
              isDataGrouped={false}
              orientation={values.orientation}
            />
          )
        }
      />
    </Stack>
  );
}
