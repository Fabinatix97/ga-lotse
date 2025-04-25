/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useState } from "react";
import { isDefined } from "remeda";

import { ApiInventoryItemType, ApiLabel } from "@eshg/base-api";
import {
  ActiveFilter,
  FilterSettingsContentProps,
  ToggleFilterButtonProps,
  UseTableControlResult,
} from "@eshg/lib-employee-portal";

import {
  inventoryItemTypeNames,
  inventoryTypeOptions,
} from "@/lib/baseModule/components/inventory/constants";
import { SingleSelectFilter } from "@/lib/shared/components/tableFilters/SingleSelectFilter";

interface InventoryFilterSettingsProps {
  typeFilter: ApiInventoryItemType | undefined;
  labelFilter: string | undefined;
  tableControl: UseTableControlResult;
  labels: ApiLabel[];
}

interface FilterDefinition {
  key: string;
  value: string;
  label: string;
}

interface UseInventoryFilterSettings {
  filterSettingsContentProps: FilterSettingsContentProps;
  filterButtonProps: ToggleFilterButtonProps;
  filterSheetVisible: boolean;
}

export function useInventoryFilterSettings(
  props: InventoryFilterSettingsProps,
): UseInventoryFilterSettings {
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);

  const activeFilters: FilterDefinition[] = [];
  if (isDefined(props.typeFilter)) {
    activeFilters.push({
      key: "type",
      value: props.typeFilter,
      label: inventoryItemTypeNames[props.typeFilter],
    });
  }
  if (isDefined(props.labelFilter)) {
    activeFilters.push({
      key: "label",
      value: props.labelFilter,
      label: props.labelFilter,
    });
  }

  function clearFilters() {
    props.tableControl.setFilter([
      {
        name: "type",
        value: undefined,
      },
      {
        name: "label",
        value: undefined,
      },
    ]);
  }

  function getFilter(key: string) {
    return activeFilters.find((filter) => filter.key === key)!;
  }

  function deleteFilter(key: string) {
    props.tableControl.setFilter([{ name: key, value: undefined }], true);
  }

  return {
    filterSheetVisible,
    filterButtonProps: {
      activeFilters: activeFilters.length,
      isFilterVisible: filterSheetVisible,
      onClick: () => setFilterSheetVisible((prev) => !prev),
    },
    filterSettingsContentProps: {
      showActiveFilters: activeFilters.length > 0,
      activeFilters: (
        <ActiveFilter
          maxVisible={3}
          deleteAllFilterValues={clearFilters}
          filterValues={activeFilters}
          deleteFilterValue={deleteFilter}
          getFilterValueLabel={(filter) => getFilter(filter.key)?.label}
        />
      ),
      children: (
        <Stack gap={2}>
          <SingleSelectFilter
            options={inventoryTypeOptions}
            placeholder={"Typ"}
            searchParamName={"type"}
            tableControl={props.tableControl}
            sx={{
              width: undefined,
            }}
          />
          <SingleSelectFilter
            options={props.labels.map((label) => ({
              label: label.name,
              value: label.name,
            }))}
            placeholder={"Label"}
            searchParamName={"label"}
            tableControl={props.tableControl}
            sx={{
              width: undefined,
            }}
          />
        </Stack>
      ),
    },
  };
}
