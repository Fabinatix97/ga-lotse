/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureStatus } from "@eshg/employee-portal-api/base";
import {
  ApiCaseStatus,
  ApiMPFacilityType,
  ApiMeasure,
  ApiProofRequestSent,
  ApiRoleStatus,
  ApiSubmissionResult,
} from "@eshg/employee-portal-api/measlesProtection";
import { ifDefined } from "@eshg/lib-portal/helpers/ifDefined";
import { useMemo } from "react";

import {
  caseStatusNames,
  facilityTypeNames,
  measureNames,
  proofRequestSentNames,
  roleStatusNames,
  submissionResultLabels,
} from "@/lib/businessModules/measlesProtection/components/procedures/constants";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { FilterDefinition } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import { useFilterSettings } from "@/lib/shared/components/filterSettings/useFilterSettings";
import { useSearchParamStateProvider } from "@/lib/shared/components/filterSettings/useSearchParamStateProvider";
import { procedureStatusNames } from "@/lib/shared/components/procedures/constants";

type ProceduresFilterDefinition = FilterDefinition & {
  key: keyof ProcedureFilters;
};

const filterDefinitions = [
  {
    key: "creationDate",
    name: "Erstellungsdatum",
    type: "Date",
  },
  {
    key: "birthday",
    name: "Geburtstag",
    type: "Date",
  },
  {
    key: "facilityType",
    name: "Einrichtungsart",
    type: "Enum",
    options: Object.entries(facilityTypeNames).map(toLabelValue),
  },
  {
    key: "caseStatus",
    name: "Bearbeitungsstand",
    type: "Enum",
    options: Object.entries(caseStatusNames).map(toLabelValue),
  },
  {
    key: "procedureStatus",
    name: "Status",
    type: "Enum",
    options: Object.entries(procedureStatusNames).map(toLabelValue),
  },
  {
    key: "roleStatus",
    name: "Personenstatus",
    type: "Enum",
    options: Object.entries(roleStatusNames).map(toLabelValue),
  },
  {
    key: "measure",
    name: "Maßnahmen",
    type: "Enum",
    options: Object.entries(measureNames).map(toLabelValue),
  },
  {
    key: "proofRequestSent",
    name: "Anschreiben",
    type: "Enum",
    options: Object.entries(proofRequestSentNames).map(toLabelValue),
  },
  {
    key: "proofSubmissionResult",
    name: "Nachweisresultat",
    type: "Enum",
    options: Object.entries(submissionResultLabels).map(toLabelValue),
  },
  {
    key: "hasAppointment",
    name: "Termin",
    type: "EnumSingle",
    options: [
      {
        label: "mit Termin",
        value: "true",
      },
      {
        label: "ohne Termin",
        value: "false",
      },
    ],
  },
] as const satisfies ProceduresFilterDefinition[];

const initialValues: FilterValue[] = [];

export interface ProcedureFilters {
  creationDate?: Date;
  birthday?: Date;
  facilityType?: Set<ApiMPFacilityType>;
  caseStatus?: Set<ApiCaseStatus>;
  procedureStatus?: Set<ApiProcedureStatus>;
  roleStatus?: Set<ApiRoleStatus>;
  hasAppointment?: boolean;
  measure?: Set<ApiMeasure>;
  proofRequestSent?: Set<ApiProofRequestSent>;
  proofSubmissionResult?: Set<ApiSubmissionResult>;
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
      creationDate: ifDefined(
        foundFilters.creationDate?.selectedValue,
        (v) => new Date(v),
      ),
      birthday: ifDefined(
        foundFilters.birthday?.selectedValue,
        (v) => new Date(v),
      ),
      facilityType: toSet(
        foundFilters.facilityType?.selectedValues,
        ApiMPFacilityType,
      ),
      caseStatus: toSet(foundFilters.caseStatus?.selectedValues, ApiCaseStatus),
      procedureStatus: toSet(
        foundFilters.procedureStatus?.selectedValues,
        ApiProcedureStatus,
      ),
      roleStatus: toSet(foundFilters.roleStatus?.selectedValues, ApiRoleStatus),
      hasAppointment: ifDefined(
        foundFilters.hasAppointment?.selectedValue,
        (v) => v === "true",
      ),
      measure: toSet(foundFilters.measure?.selectedValues, ApiMeasure),
      proofRequestSent: toSet(
        foundFilters.proofRequestSent?.selectedValues,
        ApiProofRequestSent,
      ),
      proofSubmissionResult: toSet(
        foundFilters.proofSubmissionResult?.selectedValues,
        ApiSubmissionResult,
      ),
    };
  }, [activeValues]);
}

export function ProceduresTableFilters() {
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

export function ProceduresTableFilterButton() {
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
