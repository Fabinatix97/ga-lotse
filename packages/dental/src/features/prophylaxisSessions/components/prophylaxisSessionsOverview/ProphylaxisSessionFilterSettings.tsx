/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormControl, FormLabel } from "@mui/joy";

import { GetProphylaxisSessionsRequest } from "@eshg/dental-api";
import {
  ActiveFilter,
  FilterSettingsContent,
  FilterSettingsSheet,
  FilterSettingsSheetProps,
  ResettableSingleSelect,
  SearchInstitutionFilter,
  SetDictionaryFilterFn,
} from "@eshg/lib-employee-portal";
import { SelectOptions } from "@eshg/lib-portal/components/formFields/SelectOptions";

import { SCHOOL_OR_DAYCARE_CONTACT } from "../../../../config/contacts";
import {
  PROPHYLAXIS_STATUS_OPTIONS,
  PROPHYLAXIS_TYPE_OPTIONS,
} from "../../../../config/prophylaxisSession";

export type ProphylaxisSessionFilters = Pick<
  GetProphylaxisSessionsRequest,
  "typeFilter" | "institutionIdFilter" | "statusFilter"
>;

const FILTER_NAMES: Record<keyof ProphylaxisSessionFilters, string> = {
  typeFilter: "Typ",
  institutionIdFilter: "Einrichtung",
  statusFilter: "Status",
};

function getFilterLabel(
  filterValue: ActiveFilter<keyof ProphylaxisSessionFilters>,
) {
  return FILTER_NAMES[filterValue.key];
}

interface ProphylaxisSessionFilterSettingsProps {
  filterFormValues: ProphylaxisSessionFilters;
  setFilterFormValue: SetDictionaryFilterFn<
    keyof ProphylaxisSessionFilters,
    ProphylaxisSessionFilters
  >;
  deleteFilterValue: (key: keyof ProphylaxisSessionFilters) => void;
  clearFilterValues: () => void;
  filterSettingsSheetProps: FilterSettingsSheetProps;
  activeFilters: ActiveFilter<keyof ProphylaxisSessionFilters>[];
}

export function ProphylaxisSessionFilterSettings(
  props: ProphylaxisSessionFilterSettingsProps,
) {
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
            onChange={(institutionId) =>
              props.setFilterFormValue("institutionIdFilter", institutionId)
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Typ</FormLabel>
          <ResettableSingleSelect
            value={props.filterFormValues.typeFilter ?? ""}
            onChange={(_, newValue) => {
              if (newValue === null) {
                return;
              }
              props.setFilterFormValue("typeFilter", newValue);
            }}
            onResetSelect={() => {
              props.setFilterFormValue("typeFilter", undefined);
            }}
          >
            <SelectOptions options={PROPHYLAXIS_TYPE_OPTIONS} />
          </ResettableSingleSelect>
        </FormControl>
        <FormControl>
          <FormLabel>Status</FormLabel>
          <ResettableSingleSelect
            value={props.filterFormValues.statusFilter ?? ""}
            onChange={(_, newValue) => {
              if (newValue === null) {
                return;
              }
              props.setFilterFormValue("statusFilter", newValue);
            }}
            onResetSelect={() => {
              props.setFilterFormValue("statusFilter", undefined);
            }}
          >
            <SelectOptions options={PROPHYLAXIS_STATUS_OPTIONS} />
          </ResettableSingleSelect>
        </FormControl>
      </FilterSettingsContent>
    </FilterSettingsSheet>
  );
}
