/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGdprProcedureType } from "@eshg/employee-portal-api/base";
import { Stack, ToggleButtonGroup, Typography } from "@mui/joy";
import { useState } from "react";
import { isDefined } from "remeda";

import { typeTranslation } from "@/lib/baseModule/components/gdpr/i18n";
import { FilterButtonProps } from "@/lib/shared/components/buttons/FilterButton";
import { ToggleButton } from "@/lib/shared/components/buttons/ToggleButton";
import { ActiveFilter } from "@/lib/shared/components/filterSettings/ActiveFilter";
import { FilterSettingsContentProps } from "@/lib/shared/components/filterSettings/FilterSettingsContent";
import { UseTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

interface GdprProcedureFilterSettingsProps {
  typeFilter: ApiGdprProcedureType | undefined;
  tableControl: UseTableControl;
}

interface FilterDefinition {
  key: string;
  value: string;
  label: string;
}

interface UseGdprProcedureFilterSettings {
  filterSettingsContentProps: FilterSettingsContentProps;
  filterButtonProps: FilterButtonProps;
  filterSheetVisible: boolean;
}

export function useGdprProcedureFilterSettings(
  props: GdprProcedureFilterSettingsProps,
): UseGdprProcedureFilterSettings {
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);

  const activeFilters: FilterDefinition[] = [];
  if (isDefined(props.typeFilter)) {
    activeFilters.push({
      key: "type",
      value: props.typeFilter,
      label: typeTranslation[props.typeFilter],
    });
  }

  function clearFilters() {
    props.tableControl.setFilter([
      {
        name: "type",
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
          <Typography level="title-sm" id="toggle-type-filter-label">
            Typ filter
          </Typography>
          <ToggleButtonGroup
            aria-labelledby="toggle-type-filter-label"
            orientation="vertical"
            color="primary"
            value={props.typeFilter}
            onChange={(_event, newValue) =>
              props.tableControl.setFilter([{ name: "type", value: newValue }])
            }
          >
            {Object.entries(typeTranslation).map(([type, label]) => (
              <ToggleButton key={type} value={type}>
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      ),
    },
  };
}
