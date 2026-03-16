/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AriaRole, useMemo } from "react";

import { ApiProcedureStatus } from "@eshg/base-api";
import { ApiInstructionType } from "@eshg/infection-briefing-api";
import {
  FilterDefinition,
  FilterSettings,
  FilterSettingsSheet,
  FilterValue,
  ToggleFilterButton,
  toSet,
  useFilterSettings,
  useQueryParamStateProvider,
} from "@eshg/lib-employee-portal";
import { ifDefined, optionsFromRecord } from "@eshg/lib-portal";

import {
  INSTRUCTION_TYPE_VALUES,
  PROCEDURE_STATUS_VALUES,
} from "../../../shared/constants";

export const ACTIVE_PANEL_NAME = "activePanel";

type ProceduresFilterDefinition = FilterDefinition & {
  key: keyof ProcedureFilters;
};

export const infectionBriefingProcedureStatusFilterNames = Object.fromEntries(
  [
    ApiProcedureStatus.Draft,
    ApiProcedureStatus.Open,
    ApiProcedureStatus.Closed,
    ApiProcedureStatus.Aborted,
  ].map((status) => [status, PROCEDURE_STATUS_VALUES[status]]),
) satisfies Record<string, string>;

export const infectionBriefingProcedureInstructionTypeFilterNames =
  Object.fromEntries(
    [ApiInstructionType.Online, ApiInstructionType.OnSite].map((type) => [
      type,
      INSTRUCTION_TYPE_VALUES[type],
    ]),
  ) satisfies Record<string, string>;

const filterDefinitions = [
  {
    type: "Enum",
    key: "statuses",
    name: "Status",
    options: optionsFromRecord(infectionBriefingProcedureStatusFilterNames),
  },
  {
    type: "EnumSingle",
    key: "appointmentType",
    name: "Belehrungsart (online/vor Ort)",
    options: optionsFromRecord(
      infectionBriefingProcedureInstructionTypeFilterNames,
    ),
  },
  {
    type: "Year",
    key: "appointmentYear",
    name: "Jahr der Belehrung",
  },
] as const satisfies ProceduresFilterDefinition[];

export interface ProcedureFilters {
  statuses?: Set<ApiProcedureStatus>;
  appointmentType?: ApiInstructionType;
  appointmentYear?: number;
}

export function useProceduresFilterState() {
  return useQueryParamStateProvider(filterDefinitions, {
    openParamName: ACTIVE_PANEL_NAME,
    openParamValue: "filters",
  });
}

type ActualProcedureFilterDefinition = (typeof filterDefinitions)[number];
type SpecificFilterValue<Key> = FilterValue &
  Pick<ActualProcedureFilterDefinition & { key: Key }, "type" | "key">;
export function useProceduresFilters(): ProcedureFilters {
  const { activeValues } = useQueryParamStateProvider(filterDefinitions);
  return useMemo(() => {
    const foundFilters = filterDefinitions.reduce(
      (filtersMap, def: FilterDefinition) => ({
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
      statuses: toSet(
        foundFilters.statuses?.selectedValues,
        ApiProcedureStatus,
      ),
      appointmentType: ifDefined(
        foundFilters.appointmentType?.selectedValue,
        (v) =>
          (Object.values(ApiInstructionType) as string[]).includes(v)
            ? (v as ApiInstructionType)
            : undefined,
      ),
      appointmentYear: ifDefined(
        foundFilters.appointmentYear?.selectedValue,
        (v) => Number.parseInt(v),
      ),
    };
  }, [activeValues]);
}

export interface InfectionBriefingProceduresTableFiltersProps {
  filtersPanelId: string;
}

export function InfectionBriefingProceduresTableFilters({
  filtersPanelId,
}: InfectionBriefingProceduresTableFiltersProps) {
  const stateProvider = useProceduresFilterState();

  const filterSettings = useFilterSettings({
    definitions: filterDefinitions,
    stateProvider,
    onValuesSubmit: (_values: FilterValue[]) => undefined,
    showSearch: false,
  });
  return (
    <FilterSettingsSheet
      {...filterSettings.filterSettingsSheetProps}
      id={filtersPanelId}
    >
      <FilterSettings {...filterSettings.filterSettingsProps} />
    </FilterSettingsSheet>
  );
}

export function InfectionBriefingProceduresTableFilterButton(props: {
  role?: AriaRole;
  "aria-expanded": boolean;
  "aria-controls": string;
}) {
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
      {...props}
      isFilterVisible={filterSettingsVisible}
      activeFilters={activeFilterCount}
      onClick={() => setFilterSettingsVisible((prev) => !prev)}
    />
  );
}
