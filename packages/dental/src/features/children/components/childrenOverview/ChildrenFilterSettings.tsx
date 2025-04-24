/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
import { SelectOptions } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { useHasChanged } from "@eshg/lib-portal/hooks/useHasChanged";
import { CircularProgress, FormControl, FormLabel } from "@mui/joy";
import { useEffect } from "react";

import { useSearchInstitutionGroupsQuery } from "@/api/queries/groups";
import { ProcedureLabelFilter } from "@/components/procedureLabels/ProcedureLabelFilter";
import { SCHOOL_OR_DAYCARE_CONTACT } from "@/config/contacts";

export type ChildrenFilters = Pick<
  GetChildrenRequest,
  "groupNameFilter" | "institutionIdFilter"
> & { procedureLabelsFilter?: ProcedureLabel[] };

const FILTER_NAMES: Record<keyof ChildrenFilters, string> = {
  groupNameFilter: "Gruppe",
  institutionIdFilter: "Einrichtung",
  procedureLabelsFilter: "Kennungen",
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
  const searchGroups = useSearchInstitutionGroupsQuery(
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
