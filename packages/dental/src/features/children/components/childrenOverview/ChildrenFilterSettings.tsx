/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CircularProgress, FormControl, FormLabel } from "@mui/joy";
import { isEmpty } from "remeda";

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
  SetDictionaryFiltersFn,
  mapToSelectOption,
} from "@eshg/lib-employee-portal";
import { SelectOption, SelectOptions } from "@eshg/lib-portal";

import { useSearchInstitutionGroupsQuery } from "../../../../api/queries/groups";
import { ProcedureLabelFilter } from "../../../../components/procedureLabels/ProcedureLabelFilter";
import { FLUORIDATION_CONSENTED_OPTIONS } from "../../../../config/child";
import { SCHOOL_OR_DAYCARE_CONTACT } from "../../../../config/contacts";

export type ChildrenFilters = Pick<
  GetChildrenRequest,
  "institutionIdFilter" | "fluoridationConsentFilter"
> & {
  procedureLabelsFilter?: ProcedureLabel[];
  excludedProcedureLabelsFilter?: ProcedureLabel[];
  groupFilter?: GroupFilter;
};

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
  excludedProcedureLabelsFilter: "Ohne Kennungen",
  fluoridationConsentFilter: "Fluoridierungseinverständnis",
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
  setFilterFormValues: SetDictionaryFiltersFn<
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
    true,
  );
  const groups = searchGroups.isSuccess ? searchGroups.data : [];

  function resolveGroupFilterOptions() {
    const existingGroupOptions = groups.map(mapToSelectOption);
    return [NO_GROUP_OPTION, ...existingGroupOptions];
  }

  const groupOptions = resolveGroupFilterOptions();

  function setLabelFilterFormValues(
    labelsValues: ProcedureLabel[],
    excludedLabelsValues: ProcedureLabel[],
  ) {
    props.setFilterFormValues([
      {
        name: "procedureLabelsFilter",
        value: isEmpty(labelsValues) ? undefined : labelsValues,
      },
      {
        name: "excludedProcedureLabelsFilter",
        value: isEmpty(excludedLabelsValues) ? undefined : excludedLabelsValues,
      },
    ]);
  }
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
              props.setFilterFormValues([
                { name: "institutionIdFilter", value: institutionId },
                { name: "groupFilter", value: undefined },
              ]);
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
            const filteredExcludedProcedureLabels = removeAllLabel(
              props.filterFormValues.excludedProcedureLabelsFilter ?? [],
              newValue,
            );
            setLabelFilterFormValues(
              newValue,
              filteredExcludedProcedureLabels ?? [],
            );
          }}
        />
        <ProcedureLabelFilter
          label={FILTER_NAMES.excludedProcedureLabelsFilter}
          values={props.filterFormValues.excludedProcedureLabelsFilter}
          onChange={(newValue: ProcedureLabel[]) => {
            const filteredProcedureLabels = removeAllLabel(
              props.filterFormValues.procedureLabelsFilter ?? [],
              newValue,
            );
            setLabelFilterFormValues(filteredProcedureLabels ?? [], newValue);
          }}
        />
        <FormControl>
          <FormLabel>Fluoridierungseinverständnis</FormLabel>
          <ResettableSingleSelect
            value={props.filterFormValues.fluoridationConsentFilter ?? ""}
            onChange={(_, newValue) => {
              if (newValue === null) {
                return;
              }
              props.setFilterFormValue("fluoridationConsentFilter", newValue);
            }}
            onResetSelect={() => {
              props.setFilterFormValue("fluoridationConsentFilter", undefined);
            }}
          >
            <SelectOptions options={FLUORIDATION_CONSENTED_OPTIONS} />
          </ResettableSingleSelect>
        </FormControl>
      </FilterSettingsContent>
    </FilterSettingsSheet>
  );
}

function removeAllLabel(
  labels: ProcedureLabel[],
  labelsToRemove: ProcedureLabel[],
): ProcedureLabel[] {
  return labels.filter(
    (label) => !labelsToRemove.map((label) => label.id).includes(label.id),
  );
}
