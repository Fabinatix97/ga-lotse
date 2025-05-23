/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CircularProgress, FormControl, FormLabel } from "@mui/joy";
import { useEffect } from "react";

import { GetChildrenRequest } from "@eshg/dental-api";
import {
  ActiveFilter,
  FilterSettingsContent,
  FilterSettingsSheet,
  FilterSettingsSheetProps,
  ProcedureLabel,
  ResettableSingleSelect,
  SearchInstitutionFilter,
  SetDictionaryFilterFn,
  mapToSelectOption,
} from "@eshg/lib-employee-portal";
import { SelectOption, SelectOptions, useHasChanged } from "@eshg/lib-portal";

import { useSearchInstitutionGroupsQuery } from "../../../../api/queries/groups";
import { ProcedureLabelFilter } from "../../../../components/procedureLabels/ProcedureLabelFilter";
import { SCHOOL_OR_DAYCARE_CONTACT } from "../../../../config/contacts";

export type ChildrenFilters = Pick<
  GetChildrenRequest,
  "institutionIdFilter"
> & { procedureLabelsFilter?: ProcedureLabel[]; groupFilter?: GroupFilter };

type GroupFilter = GroupNameFilter | NoGroupFilter;

interface GroupNameFilter {
  type: "groupName";
  groupName: string;
}

interface NoGroupFilter {
  type: "noGroup";
}

const FILTER_NAMES: Record<keyof ChildrenFilters, string> = {
  groupFilter: "Gruppe",
  institutionIdFilter: "Einrichtung",
  procedureLabelsFilter: "Kennungen",
};

const NO_GROUP_VALUE = "[noGroup]";
const NO_GROUP_OPTION: SelectOption = {
  label: "Keine Gruppe",
  value: NO_GROUP_VALUE,
};

function resolveGroupFilterValue(groupFilter: GroupFilter | undefined) {
  switch (groupFilter?.type) {
    case "noGroup":
      return NO_GROUP_VALUE;
    case "groupName":
      return groupFilter.groupName;
    case undefined:
      return null;
  }
}

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
  const searchGroups = useSearchInstitutionGroupsQuery(
    props.filterFormValues.institutionIdFilter ?? "",
  );
  const groups = searchGroups.isSuccess ? searchGroups.data : [];

  function resolveGroupFilterOptions() {
    const existingGroupOptions = groups.map(mapToSelectOption);
    return [NO_GROUP_OPTION, ...existingGroupOptions];
  }

  const groupOptions = resolveGroupFilterOptions();

  const shouldClearGroupName = useHasChanged(
    props.filterFormValues.institutionIdFilter,
  );
  useEffect(() => {
    if (shouldClearGroupName) {
      props.setFilterFormValue("groupFilter", undefined);
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
            placeholder="Schule/Kita suchen"
            institutionId={props.filterFormValues.institutionIdFilter}
            categories={SCHOOL_OR_DAYCARE_CONTACT}
            onChange={(institutionId) => {
              props.setFilterFormValue("institutionIdFilter", institutionId);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Gruppe</FormLabel>
          <ResettableSingleSelect
            aria-label="Gruppe"
            value={resolveGroupFilterValue(props.filterFormValues.groupFilter)}
            otherEndDecorator={
              searchGroups.isLoading ? (
                <CircularProgress size="sm" />
              ) : undefined
            }
            onChange={(_, newValue) => {
              if (newValue === NO_GROUP_VALUE) {
                props.setFilterFormValue("groupFilter", { type: "noGroup" });
              } else if (newValue === null) {
                props.setFilterFormValue("groupFilter", undefined);
              } else {
                props.setFilterFormValue("groupFilter", {
                  type: "groupName",
                  groupName: newValue,
                });
              }
            }}
            onResetSelect={() => {
              props.setFilterFormValue("groupFilter", undefined);
            }}
          >
            <SelectOptions options={groupOptions} />
          </ResettableSingleSelect>
        </FormControl>
        <ProcedureLabelFilter
          label={FILTER_NAMES.procedureLabelsFilter}
          values={props.filterFormValues.procedureLabelsFilter}
          onChange={(newValue: ProcedureLabel[]) => {
            const filterValue = newValue.length > 0 ? newValue : undefined;
            props.setFilterFormValue("procedureLabelsFilter", filterValue);
          }}
        />
      </FilterSettingsContent>
    </FilterSettingsSheet>
  );
}
