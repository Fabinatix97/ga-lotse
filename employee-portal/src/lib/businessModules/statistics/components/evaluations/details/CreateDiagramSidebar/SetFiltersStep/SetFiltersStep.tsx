/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UseFilterSettings } from "@eshg/lib-employee-portal";

import { mapAttributesToFilterDefinitions } from "@/lib/businessModules/statistics/api/mapper/mapAttributesToFilterDefinitions";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { SetFiltersStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateDiagramSidebar/SetFiltersStep/setFiltersStepFormModel";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { UseFilterTemplateProps } from "@/lib/shared/components/filterSettings/useFilterTemplate";
import { FilterSettingsField } from "@/lib/shared/components/formFields/FilterSettingsField";

export interface SetFiltersStepProps
  extends SidebarStepContentProps<SetFiltersStepFormModel> {
  attributes: FlatAttribute[];
  getUseFilterTemplateProps: (
    filterSettings: UseFilterSettings,
  ) => UseFilterTemplateProps;
}

export function SetFiltersStep(props: SetFiltersStepProps) {
  return (
    <FilterSettingsField
      name={props.fieldName("filterValues")}
      definitions={mapAttributesToFilterDefinitions(props.attributes)}
      getUseFilterTemplateProps={props.getUseFilterTemplateProps}
    />
  );
}
