/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMemo } from "react";

import { ApiProcedureStatus } from "@eshg/base-api";
import {
  FilterDefinition,
  FilterSettings,
  FilterSettingsSheet,
  FilterValue,
  ToggleFilterButton,
  useFilterSettings,
  useSearchParamStateProvider,
} from "@eshg/lib-employee-portal";
import { ifDefined } from "@eshg/lib-portal";

type ProceduresFilterDefinition = FilterDefinition &
  (
    | {
        key: keyof ProcedureFilters;
      }
    | { key: "creationDate" }
  );

const filterDefinitions = [
  {
    type: "DateSpan",
    key: "creationDate",
    name: "Erstelldatum",
    doNotRequireStartAndEnd: true,
  },
] as const satisfies ProceduresFilterDefinition[];

const initialValues: FilterValue[] = [];

export interface ProcedureFilters {
  creationDateStart?: Date;
  creationDateEnd?: Date;
  procedureStatus?: Set<ApiProcedureStatus>;
}

export function useProceduresFilterState() {
  return useSearchParamStateProvider(filterDefinitions);
}

type ActualProcedureFilterDefinition = (typeof filterDefinitions)[number];
type SpecificFilterValue<Key> = FilterValue &
  Pick<ActualProcedureFilterDefinition & { key: Key }, "type" | "key">;
export function useProceduresFilters(): ProcedureFilters {
  const { activeValues } = useSearchParamStateProvider(filterDefinitions);
  return useMemo(() => {
    const foundFilters = filterDefinitions.reduce(
      (filtersMap, def: ProceduresFilterDefinition) => ({
        ...filtersMap,
        [def.key]: activeValues.find(
          (t) => t.key === def.key && t.type === def.type,
        ),
      }),
      {} as {
        [Key in ActualProcedureFilterDefinition["key"]]?:
          | SpecificFilterValue<Key>
          | undefined;
      },
    );

    return {
      creationDateStart: ifDefined(
        foundFilters.creationDate?.startDate,
        (v) => new Date(v),
      ),
      creationDateEnd: ifDefined(
        foundFilters.creationDate?.endDate,
        (v) => new Date(v),
      ),
    };
  }, [activeValues]);
}

export function MedsAbroadProceduresTableFilters() {
  const stateProvider = useProceduresFilterState();
  const filterSettings = useFilterSettings({
    definitions: filterDefinitions,
    stateProvider,
    initialValues: initialValues,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onValuesSubmit: (_values) => {},
  });
  return stateProvider.filterSettingsVisible ? (
    <FilterSettingsSheet {...filterSettings.filterSettingsSheetProps}>
      <FilterSettings {...filterSettings.filterSettingsProps} />
    </FilterSettingsSheet>
  ) : undefined;
}

export function MedsAbroadProceduresTableFilterButton() {
  const { filterSettingsVisible, activeValues, setFilterSettingsVisible } =
    useProceduresFilterState();
  const activeFilterCount = activeValues.reduce((count, fv) => {
    switch (fv.type) {
      case "Enum":
        return count + fv.selectedValues.length;
      default:
        return count + 1;
    }
  }, 0);

  return (
    <ToggleFilterButton
      isFilterVisible={filterSettingsVisible}
      activeFilters={activeFilterCount}
      onClick={() => setFilterSettingsVisible((prev) => !prev)}
    />
  );
}
