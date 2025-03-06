/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureStatus } from "@eshg/base-api";
import { ifDefined } from "@eshg/lib-portal/helpers/ifDefined";
import {
  ApiConcern,
  ApiGender,
  ApiLabStatus,
  ApiStiProcedureOrigin,
} from "@eshg/sti-protection-api";
import { useMemo } from "react";

import {
  CONCERN_VALUES,
  GENDER_VALUES,
  LAB_STATUS_VALUES,
  PROCEDURE_ORIGIN_VALUES,
} from "@/lib/businessModules/stiProtection/shared/constants";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { FilterDefinition } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import { useFilterSettings } from "@/lib/shared/components/filterSettings/useFilterSettings";
import { useSearchParamStateProvider } from "@/lib/shared/components/filterSettings/useSearchParamStateProvider";
import { procedureStatusNames } from "@/lib/shared/components/procedures/constants";

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
    options: Object.entries(procedureStatusNames).map(toLabelValue),
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
  yearOfBirth?: number;
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
      yearOfBirth: ifDefined(foundFilters.yearOfBirth?.selectedValue, parseInt),
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
    <FilterButton
      isFilterVisible={filterSettingsVisible}
      activeFilters={activeFilterCount}
      onClick={() => setFilterSettingsVisible((prev) => !prev)}
    />
  );
}
