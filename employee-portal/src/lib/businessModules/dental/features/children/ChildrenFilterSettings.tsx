/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSearchInstitutionGroups } from "@eshg/dental";
import { GetChildrenRequest } from "@eshg/dental-api";
import { SelectOptions } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { useHasChanged } from "@eshg/lib-portal/hooks/useHasChanged";
import { CircularProgress, FormControl, FormLabel } from "@mui/joy";
import { useEffect } from "react";

import { ResettableSingleSelect } from "@/lib/shared/components/ResettableSingleSelect";
import { ActiveFilter } from "@/lib/shared/components/filterSettings/ActiveFilter";
import { FilterSettingsContent } from "@/lib/shared/components/filterSettings/FilterSettingsContent";
import {
  FilterSettingsSheet,
  FilterSettingsSheetProps,
} from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { SearchInstitutionFilter } from "@/lib/shared/components/filterSettings/SearchInstitutionFilter";
import { SetDictionaryFilterFn } from "@/lib/shared/components/filterSettings/useFilterDictionary";
import { mapToSelectOption } from "@/lib/shared/helpers/selectOptionMapper";

export type ChildrenFilters = Pick<
  GetChildrenRequest,
  "groupNameFilter" | "institutionIdFilter"
>;

const FILTER_NAMES: Record<keyof ChildrenFilters, string> = {
  groupNameFilter: "Gruppe",
  institutionIdFilter: "Einrichtung",
};

function getFilterLabel(filterValue: ActiveFilter<keyof ChildrenFilters>) {
  return FILTER_NAMES[filterValue.key];
}

interface ChildrenFilterSettingsProps {
  filterFormValues: ChildrenFilters;
  setFilterFormValue: SetDictionaryFilterFn<
    keyof ChildrenFilters,
    ChildrenFilters
  >;
  deleteFilterValue: (key: keyof ChildrenFilters) => void;
  clearFilterValues: () => void;
  filterSettingsSheetProps: FilterSettingsSheetProps;
  activeFilters: ActiveFilter<keyof ChildrenFilters>[];
}

export function ChildrenFilterSettings(props: ChildrenFilterSettingsProps) {
  const searchGroups = useSearchInstitutionGroups(
    props.filterFormValues.institutionIdFilter ?? "",
  );
  const groups = searchGroups.isSuccess ? searchGroups.data : [];
  const groupOptions = groups.map(mapToSelectOption);

  const shouldClearGroupName = useHasChanged(
    props.filterFormValues.institutionIdFilter,
  );
  useEffect(() => {
    if (shouldClearGroupName) {
      props.setFilterFormValue("groupNameFilter", undefined);
    }
  }, [shouldClearGroupName, props, props.deleteFilterValue]);

  return (
    <FilterSettingsSheet {...props.filterSettingsSheetProps}>
      <FilterSettingsContent
        showActiveFilters={props.activeFilters.length > 0}
        activeFilters={
          <ActiveFilter
            maxVisible={5}
            filterValues={props.activeFilters}
            deleteAllFilterValues={props.clearFilterValues}
            deleteFilterValue={props.deleteFilterValue}
            getFilterValueLabel={getFilterLabel}
          />
        }
      >
        <FormControl>
          <FormLabel>Einrichtung</FormLabel>
          <SearchInstitutionFilter
            institutionId={props.filterFormValues.institutionIdFilter}
            onChange={(institutionId) => {
              props.setFilterFormValue("institutionIdFilter", institutionId);
            }}
            placeholder="Schule/Kita suchen"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Gruppe</FormLabel>
          <ResettableSingleSelect
            aria-label="Gruppe"
            value={props.filterFormValues.groupNameFilter ?? ""}
            onChange={(_, newValue) => {
              if (newValue === null) {
                return;
              }
              props.setFilterFormValue("groupNameFilter", newValue);
            }}
            onResetSelect={() => {
              props.setFilterFormValue("groupNameFilter", undefined);
            }}
            otherEndDecorator={
              searchGroups.isLoading ? (
                <CircularProgress size="sm" />
              ) : undefined
            }
          >
            <SelectOptions options={groupOptions} />
          </ResettableSingleSelect>
        </FormControl>
      </FilterSettingsContent>
    </FilterSettingsSheet>
  );
}
