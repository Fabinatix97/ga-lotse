/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { ConfigurePieChartFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigurePieChartStep/configurePieChartFormModel";
import { mapAttributeToAutocompleteSelectionOption } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/mapAttribute";
import { isBooleanOrValueWithOptions } from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { AutocompleteSelectOption } from "@/lib/shared/components/AutocompleteSelectOptions";

export function ConfigurePieChartStep({
  attributes,
}: {
  attributes: FlatAttribute[];
}) {
  const fieldName = createFieldNameMapper<ConfigurePieChartFormModel>(
    "configurePieChartFormModel",
  );
  const primaryAttributes: AutocompleteSelectOption[] = attributes.map(
    mapAttributeToAutocompleteSelectionOption((attr) =>
      isBooleanOrValueWithOptions(attr.type),
    ),
  );
  return (
    <Stack gap={3}>
      <Stack gap={2}>
        <SingleAutocompleteField
          options={primaryAttributes}
          name={fieldName("primaryAttribute")}
          placeholder="Bitte wählen"
          label="Primäres Attribut"
          required="Bitte wählen Sie ein Attribut aus."
        />
      </Stack>
    </Stack>
  );
}
