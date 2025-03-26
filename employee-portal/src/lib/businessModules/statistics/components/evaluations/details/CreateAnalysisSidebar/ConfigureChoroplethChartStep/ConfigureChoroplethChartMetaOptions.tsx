/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import { ChoroplethChartMetaFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { colorSchemeNames } from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

export function ConfigureChoroplethChartMetaOptions({
  fieldName,
}: SidebarStepContentProps<ChoroplethChartMetaFormModel>) {
  const colorSchemes = buildEnumOptions(colorSchemeNames);

  return (
    <SingleAutocompleteField
      options={colorSchemes}
      name={fieldName("colorScheme")}
      placeholder="Bitte wählen"
      label="Farbschema"
      required="Bitte wählen Sie ein Farbschema aus."
    />
  );
}
