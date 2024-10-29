/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDefined } from "remeda";

import {
  SearchableGroup,
  SearchableGroupItem,
  SearchableGroups,
} from "@/lib/shared/components/SearchableGroups";
import { DateSpanFilter } from "@/lib/shared/components/filterSettings/DateSpanFilter";
import { FilterSettingsContent } from "@/lib/shared/components/filterSettings/FilterSettingsContent";
import {
  FilterTemplates,
  FilterTemplatesProps,
} from "@/lib/shared/components/filterSettings/FilterTemplates";
import { YearFilter } from "@/lib/shared/components/filterSettings/YearFilter";
import { FilterDefinition } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterDraftValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import { findValueByDefinition } from "@/lib/shared/components/filterSettings/models/findValueByDefinition";

import { ActiveFilter, ActiveFilterProps } from "./ActiveFilter";
import { DateFilter } from "./DateFilter";
import { EnumFilter } from "./EnumFilter";
import { EnumSingleFilter } from "./EnumSingleFilter";
import { NumberFilter } from "./NumberFilter";

type FilterGroupItem = SearchableGroupItem & {
  filterDefinition: FilterDefinition;
};

function mapDefinitionsToSearchableGroups(
  definitions: FilterDefinition[],
): SearchableGroup<FilterGroupItem>[] {
  return definitions.map((definition) => ({
    name: definition.name,
    inAccordion: isDefined(definition.inAccordion)
      ? definition.inAccordion
      : !["EnumSingle", "Date", "Year"].includes(definition.type),
    items: [
      {
        key: definition.key,
        searchableValue: definition.name,
        filterDefinition: definition,
      },
    ],
  }));
}

export interface FilterSettingsProps {
  definitions: FilterDefinition[];
  draftValues: FilterDraftValue[];
  onDraftValueChange: (key: string, value: FilterDraftValue | null) => void;
  showActiveFilters: boolean;
  showSearch?: boolean;
  activeFilterProps: ActiveFilterProps;
  filterTemplatesProps?: FilterTemplatesProps;
}

export function FilterSettings(props: FilterSettingsProps) {
  const searchableFilters = mapDefinitionsToSearchableGroups(props.definitions);

  return (
    <FilterSettingsContent
      showActiveFilters={props.showActiveFilters}
      activeFilters={<ActiveFilter {...props.activeFilterProps} />}
      filterTemplateSelect={
        props.filterTemplatesProps ? (
          <FilterTemplates {...props.filterTemplatesProps} />
        ) : undefined
      }
    >
      <SearchableGroups
        placeholder="Filtersuche"
        hideSearch={!(props.showSearch ?? true)}
        groups={searchableFilters}
        renderItem={(item) => {
          switch (item.filterDefinition.type) {
            case "Enum":
              return (
                <EnumFilter
                  definition={item.filterDefinition}
                  value={findValueByDefinition(
                    props.draftValues,
                    item.filterDefinition,
                  )}
                  onChange={(value) =>
                    props.onDraftValueChange(item.filterDefinition.key, value)
                  }
                />
              );
            case "EnumSingle":
              return (
                <EnumSingleFilter
                  definition={item.filterDefinition}
                  value={findValueByDefinition(
                    props.draftValues,
                    item.filterDefinition,
                  )}
                  onChange={(value) =>
                    props.onDraftValueChange(item.filterDefinition.key, value)
                  }
                />
              );
            case "Number":
              return (
                <NumberFilter
                  definition={item.filterDefinition}
                  value={findValueByDefinition(
                    props.draftValues,
                    item.filterDefinition,
                  )}
                  onChange={(value) =>
                    props.onDraftValueChange(item.filterDefinition.key, value)
                  }
                />
              );
            case "Date":
              return (
                <DateFilter
                  definition={item.filterDefinition}
                  value={findValueByDefinition(
                    props.draftValues,
                    item.filterDefinition,
                  )}
                  onChange={(value) =>
                    props.onDraftValueChange(item.filterDefinition.key, value)
                  }
                />
              );
            case "DateSpan":
              return (
                <DateSpanFilter
                  definition={item.filterDefinition}
                  value={findValueByDefinition(
                    props.draftValues,
                    item.filterDefinition,
                  )}
                  onChange={(value) =>
                    props.onDraftValueChange(item.filterDefinition.key, value)
                  }
                />
              );
            case "Year":
              return (
                <YearFilter
                  definition={item.filterDefinition}
                  value={findValueByDefinition(
                    props.draftValues,
                    item.filterDefinition,
                  )}
                  onChange={(value) =>
                    props.onDraftValueChange(item.filterDefinition.key, value)
                  }
                />
              );
          }
        }}
      />
    </FilterSettingsContent>
  );
}
