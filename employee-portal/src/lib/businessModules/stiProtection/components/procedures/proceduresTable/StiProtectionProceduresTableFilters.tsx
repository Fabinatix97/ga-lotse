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
  PROCEDURE_STATUS_NAMES,
  ToggleFilterButton,
  useFilterSettings,
  useSearchParamStateProvider,
} from "@eshg/lib-employee-portal";
import { GENDER_VALUES } from "@eshg/lib-portal";
import { ifDefined } from "@eshg/lib-portal/helpers/ifDefined";
import {
  ApiConcern,
  ApiGender,
  ApiLabStatus,
  ApiStiProcedureOrigin,
} from "@eshg/sti-protection-api";

import {
  CONCERN_VALUES,
  LAB_STATUS_VALUES,
  PROCEDURE_ORIGIN_VALUES,
} from "@/lib/businessModules/stiProtection/shared/constants";

type ProceduresFilterDefinition = FilterDefinition &
  (
    | {
        key: keyof ProcedureFilters;
      }
    | { key: "appointmentDate" }
    | { key: "creationDate" }
  );

const filterDefinitions = [
  {
    type: "DateSpan",
    key: "creationDate",
    name: "Erstelldatum",
    doNotRequireStartAndEnd: true,
  },
  {
    key: "yearOfBirth",
    name: "Geburtsjahr",
    type: "Year",
  },
  {
    key: "appointmentDate",
    name: "Termin",
    type: "DateSpan",
    doNotRequireStartAndEnd: true,
  },
  {
    key: "gender",
    name: "Geschlecht",
    type: "Enum",
    options: Object.entries(GENDER_VALUES).map(toLabelValue),
  },
  {
    key: "concern",
    name: "Anliegen",
    type: "Enum",
    options: Object.entries(CONCERN_VALUES).map(toLabelValue),
  },
  {
    key: "procedureStatus",
    name: "Status",
    type: "Enum",
    options: Object.entries(PROCEDURE_STATUS_NAMES).map(toLabelValue),
  },
  {
    key: "labStatus",
    name: "Laborstatus",
    type: "Enum",
    options: Object.entries(LAB_STATUS_VALUES).map(toLabelValue),
  },
  {
    key: "procedureOrigin",
    name: "Ursprung",
    type: "Enum",
    options: Object.entries(PROCEDURE_ORIGIN_VALUES).map(toLabelValue),
  },
] as const satisfies ProceduresFilterDefinition[];

const initialValues: FilterValue[] = [];

export interface ProcedureFilters {
  creationDateStart?: Date;
  creationDateEnd?: Date;
  yearOfBirth?: string;
  appointmentDateStart?: Date;
  appointmentDateEnd?: Date;
  gender?: Set<ApiGender>;
  concern?: Set<ApiConcern>;
  procedureStatus?: Set<ApiProcedureStatus>;
  labStatus?: Set<ApiLabStatus>;
  procedureOrigin?: Set<ApiStiProcedureOrigin>;
}

function toLabelValue([key, label]: [key: string, label: string]) {
  return { label, value: key };
}

export function useProceduresFilterState() {
  return useSearchParamStateProvider(filterDefinitions);
}

function toSet<T extends string>(
  list: string[] | undefined,
  map: Record<string, T>,
): Set<T> | undefined {
  if (list == null) {
    return;
  }
  const setValues = Object.values(map);
  const typedList = list.filter((t): t is T =>
    (setValues as string[]).includes(t),
  );
  if (typedList.length === 0) {
    return;
  }
  return new Set(typedList);
}

type ActualProcedureFilterDefinition = (typeof filterDefinitions)[number];
type SpecificFilterValue<Key> = FilterValue &
  Pick<ActualProcedureFilterDefinition & { key: Key }, "type" | "key">;
export function useProceduresFilters(): ProcedureFilters {
  const { activeValues } = useSearchParamStateProvider(filterDefinitions);
  return useMemo(() => {
    const foundFilters = filterDefinitions.reduce(
      (filtersMap, def) => ({
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
      yearOfBirth: foundFilters.yearOfBirth?.selectedValue,
      appointmentDateStart: ifDefined(
        foundFilters.appointmentDate?.startDate,
        (v) => new Date(v),
      ),
      appointmentDateEnd: ifDefined(
        foundFilters.appointmentDate?.endDate,
        (v) => new Date(v),
      ),
      gender: toSet(foundFilters.gender?.selectedValues, ApiGender),
      concern: toSet(foundFilters.concern?.selectedValues, ApiConcern),
      procedureStatus: toSet(
        foundFilters.procedureStatus?.selectedValues,
        ApiProcedureStatus,
      ),
      labStatus: toSet(foundFilters.labStatus?.selectedValues, ApiLabStatus),
      procedureOrigin: toSet(
        foundFilters.procedureOrigin?.selectedValues,
        ApiStiProcedureOrigin,
      ),
    };
  }, [activeValues]);
}

export function StiProtectionProceduresTableFilters() {
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

export function StiProtectionProceduresTableFilterButton() {
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
