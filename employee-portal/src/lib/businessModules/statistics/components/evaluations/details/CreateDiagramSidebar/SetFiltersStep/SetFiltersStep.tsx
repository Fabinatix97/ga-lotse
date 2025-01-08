/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";

import { mapAttributesToFilterDefinitions } from "@/lib/businessModules/statistics/api/mapper/mapAttributesToFilterDefinitions";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { SetFiltersStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateDiagramSidebar/SetFiltersStep/setFiltersStepFormModel";
import { UseFilterSettings } from "@/lib/shared/components/filterSettings/useFilterSettings";
import { UseFilterTemplateProps } from "@/lib/shared/components/filterSettings/useFilterTemplate";
import { FilterSettingsField } from "@/lib/shared/components/formFields/FilterSettingsField";

export function SetFiltersStep(props: {
  attributes: FlatAttribute[];
  getUseFilterTemplateProps: (
    filterSettings: UseFilterSettings,
  ) => UseFilterTemplateProps;
}) {
  const fieldName = createFieldNameMapper<SetFiltersStepFormModel>();

  return (
    <FilterSettingsField
      name={fieldName("filterValues")}
      definitions={mapAttributesToFilterDefinitions(props.attributes)}
      getUseFilterTemplateProps={props.getUseFilterTemplateProps}
    />
  );
}
