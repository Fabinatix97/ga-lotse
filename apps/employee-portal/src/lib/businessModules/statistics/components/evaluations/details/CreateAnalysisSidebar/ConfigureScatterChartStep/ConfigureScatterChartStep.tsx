/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { isNonNullish } from "remeda";

import { SingleAutocompleteField } from "@eshg/lib-portal";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import {
  ChartsSamplePreview,
  chartSampleConfiguration,
  getScatterChartGroupedSampleData,
  getScatterChartSimpleSampleData,
} from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ChartsSamplePreview";
import { ConfigureChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { mapAttributeToAutocompleteSelectionOption } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/mapAttribute";
import { ScatterChart } from "@/lib/businessModules/statistics/components/shared/charts/ScatterChart";
import {
  isCategorical,
  isNumeric,
} from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

import { ConfigureScatterChartMetaOptions } from "./ConfigureScatterChartMetaOptions";

interface ConfigureScatterChartStepProps extends SidebarStepContentProps<ConfigureChartFormModel> {
  attributes: FlatAttribute[];
}

export function ConfigureScatterChartStep({
  attributes,
  fieldName,
  values,
}: ConfigureScatterChartStepProps) {
  const axisAttributes = attributes.map(
    mapAttributeToAutocompleteSelectionOption((attribute) =>
      isNumeric(attribute.type),
    ),
  );
  const secondaryAttributes = attributes.map(
    mapAttributeToAutocompleteSelectionOption((attribute) =>
      isCategorical(attribute.type),
    ),
  );

  const showGroupedConfigurations =
    isNonNullish(values.secondaryAttribute) &&
    values.secondaryAttribute.length > 0;

  return (
    <Stack gap={4}>
      <Stack gap={3}>
        <Stack gap={2}>
          <SingleAutocompleteField
            autoFocus
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
        <ConfigureScatterChartMetaOptions
          fieldName={fieldName}
          values={values}
        />
      </Stack>
      <ChartsSamplePreview
        chart={
          showGroupedConfigurations ? (
            <ScatterChart
              key={`groupedScatterChart_${values.trendline}`}
              diagramData={getScatterChartGroupedSampleData(values.trendline)}
              configuration={{
                axisRange: values.axisRange,
                ...chartSampleConfiguration,
              }}
            />
          ) : (
            <ScatterChart
              key={`simpleScatterChart_${values.trendline}`}
              diagramData={getScatterChartSimpleSampleData(values.trendline)}
              configuration={{
                axisRange: values.axisRange,
                ...chartSampleConfiguration,
              }}
            />
          )
        }
      />
    </Stack>
  );
}
