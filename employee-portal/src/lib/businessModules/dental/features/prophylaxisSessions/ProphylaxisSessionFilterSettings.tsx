/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetProphylaxisSessionsRequest } from "@eshg/dental-api";
import { SelectOptions } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { FormControl, FormLabel } from "@mui/joy";

import { PROPHYLAXIS_TYPE_OPTIONS } from "@/lib/businessModules/dental/features/prophylaxisSessions/options";
import { ResettableSingleSelect } from "@/lib/shared/components/ResettableSingleSelect";
import { ActiveFilter } from "@/lib/shared/components/filterSettings/ActiveFilter";
import { FilterSettingsContent } from "@/lib/shared/components/filterSettings/FilterSettingsContent";
import {
  FilterSettingsSheet,
  FilterSettingsSheetProps,
} from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { SearchInstitutionFilter } from "@/lib/shared/components/filterSettings/SearchInstitutionFilter";
import { SetDictionaryFilterFn } from "@/lib/shared/components/filterSettings/useFilterDictionary";

export type ProphylaxisSessionFilters = Pick<
  GetProphylaxisSessionsRequest,
  "typeFilter" | "institutionIdFilter"
>;

const FILTER_NAMES: Record<keyof ProphylaxisSessionFilters, string> = {
  typeFilter: "Typ",
  institutionIdFilter: "Einrichtung",
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
            institutionId={props.filterFormValues.institutionIdFilter}
            onChange={(institutionId) =>
              props.setFilterFormValue("institutionIdFilter", institutionId)
            }
            placeholder="Schule/Kita suchen"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Typ</FormLabel>
          <ResettableSingleSelect
            aria-label="Typ"
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
      </FilterSettingsContent>
    </FilterSettingsSheet>
  );
}
