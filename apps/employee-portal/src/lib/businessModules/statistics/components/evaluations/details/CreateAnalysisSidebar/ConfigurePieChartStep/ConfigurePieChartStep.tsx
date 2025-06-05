/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { SingleAutocompleteField } from "@eshg/lib-portal";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import {
  ChartsSamplePreview,
  pieChartSampleData,
} from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ChartsSamplePreview";
import { ConfigureChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { mapAttributeToAutocompleteSelectionOption } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/mapAttribute";
import { PieChart } from "@/lib/businessModules/statistics/components/shared/charts/PieChart";
import { isCategorical } from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { AutocompleteSelectOption } from "@/lib/shared/components/AutocompleteSelectOptions";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

interface ConfigurePieChartStepProps
  extends SidebarStepContentProps<ConfigureChartFormModel> {
  attributes: FlatAttribute[];
}

export function ConfigurePieChartStep({
  attributes,
  fieldName,
}: ConfigurePieChartStepProps) {
  const primaryAttributes: AutocompleteSelectOption[] = attributes.map(
    mapAttributeToAutocompleteSelectionOption((attr) =>
      isCategorical(attr.type),
    ),
  );
  return (
    <Stack gap={4}>
      <SingleAutocompleteField
        options={primaryAttributes}
        name={fieldName("primaryAttribute")}
        placeholder="Bitte wählen"
        label="Primäres Attribut"
        required="Bitte wählen Sie ein Attribut aus."
      />
      <ChartsSamplePreview
        chart={<PieChart diagramData={pieChartSampleData} />}
      />
    </Stack>
  );
}
