/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SetStateAction, useCallback, useId, useState } from "react";
import { isDeepEqual } from "remeda";

import { FilterButtonProps } from "@/lib/shared/components/buttons/FilterButton";
import { ActiveFilterProps } from "@/lib/shared/components/filterSettings/ActiveFilter";
import { validateDateSpan } from "@/lib/shared/components/filterSettings/DateSpanFilter";
import { FilterSettingsProps } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheetProps } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { validateYear } from "@/lib/shared/components/filterSettings/YearFilter";
import { DateSpanFilterDefinition } from "@/lib/shared/components/filterSettings/models/DateSpanFilter";
import { FilterDefinition } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import {
  FilterDraftValue,
  FilterValue,
} from "@/lib/shared/components/filterSettings/models/FilterValue";
import { mapActiveToDraftValues } from "@/lib/shared/components/filterSettings/models/mapActiveToDraftValues";
import { mapDraftToActiveValues } from "@/lib/shared/components/filterSettings/models/mapDraftToActiveValues";

export interface FilterSettingsStateProvider {
  filterSettingsVisible: boolean;
  setFilterSettingsVisible: (v: SetStateAction<boolean>) => void;
  activeValues: FilterValue[];
  setActiveValues: (v: FilterValue[]) => void;
  errorMessages: string[];
  setErrorMessages: (v: SetStateAction<string[]>) => void;
}
export function useMemoryStateProvider(
  initialValues: FilterValue[],
): FilterSettingsStateProvider {
  const [filterSettingsVisible, setFilterSettingsVisible] = useState(false);
  const [activeValues, setActiveValues] =
    useState<FilterValue[]>(initialValues);
  const [errorMessages, setErrorMessages] = useState([] as string[]);

  return {
    filterSettingsVisible,
    setFilterSettingsVisible,
    errorMessages,
    setErrorMessages,
    activeValues,
    setActiveValues,
  };
}

export interface UseFilterSettingsParams {
  definitions: FilterDefinition[];
  initialValues?: FilterValue[];
  autoApply?: boolean;
  onValuesSubmit: (values: FilterValue[]) => void;
  showSearch?: boolean;
  scalingWidth?: boolean;
  stateProvider?: FilterSettingsStateProvider;
}

export interface UseFilterSettings {
  activeValues: FilterValue[];
  filterSettingsVisible: boolean;
  filterButtonProps: FilterButtonProps;
  filterSettingsProps: FilterSettingsProps;
  filterSettingsSheetProps: FilterSettingsSheetProps;
  onActiveFilterValuesChanged: (activeFilterValues: FilterValue[]) => void;
  setOnActiveFilterValuesChangedCallback: (
    callback: (activeFilterValues: FilterValue[]) => void,
  ) => void;
}

export function useFilterSettings({
  definitions,
  initialValues = [],
  autoApply = false,
  onValuesSubmit,
  showSearch = true,
  scalingWidth = false,
  stateProvider,
}: UseFilterSettingsParams): UseFilterSettings {
  const memoryStateProvider = useMemoryStateProvider(initialValues);
  const filterSettingsId = useId();

  const {
    filterSettingsVisible,
    setFilterSettingsVisible,
    errorMessages,
    setErrorMessages,
    activeValues,
    setActiveValues,
  } = stateProvider ?? memoryStateProvider;

  const [activeValuesCallback, setActiveValuesCallback] = useState<{
    callback: ((activeFilterValues: FilterValue[]) => void) | null;
  }>({ callback: null });

  const [draftValues, setFilterDraftValues] = useState<FilterDraftValue[]>(
    mapActiveToDraftValues(activeValues),
  );

  function handleDraftValueChange(key: string, value: FilterDraftValue | null) {
    function update(prev: FilterDraftValue[]) {
      const otherFilters = prev.filter((value) => value.key !== key);
      if (value === null) {
        return otherFilters;
      } else if (prev.find((value) => value.key === key)) {
        return prev.map((prevValue) =>
          prevValue.key === key ? value : prevValue,
        );
      } else {
        return [value, ...otherFilters];
      }
    }

    const nextDraftValues = update(draftValues);
    setFilterDraftValues(nextDraftValues);
    if (autoApply) {
      handleApply(nextDraftValues);
    }
  }

  function validate(nextDraftValues: FilterDraftValue[]) {
    const errorMessages = nextDraftValues
      .map(validateDraftValue)
      .filter((errorMessage) => errorMessage !== undefined);

    setErrorMessages(errorMessages);

    return errorMessages.length === 0;
  }

  function validateDraftValue(
    nextDraftValue: FilterDraftValue,
  ): string | undefined {
    switch (nextDraftValue.type) {
      case "DateSpan":
        return validateDateSpan(
          findDefinition(
            nextDraftValue.key,
            definitions,
          ) as DateSpanFilterDefinition,
          nextDraftValue,
        );
      case "Year":
        return validateYear(nextDraftValue);
      default:
        return undefined;
    }
  }

  function handleApply(nextDraftValues: FilterDraftValue[]) {
    const nextActiveValues = mapDraftToActiveValues(nextDraftValues);
    setActiveValues(nextActiveValues);
    onValuesSubmit(nextActiveValues);
    if (activeValuesCallback.callback) {
      activeValuesCallback.callback(nextActiveValues);
    }
  }

  function handleDeleteAll() {
    setErrorMessages([]);
    setFilterDraftValues([]);
    handleApply([]);
  }

  function handleDelete(key: string) {
    const nextDraftValues = draftValues.filter((value) => value.key !== key);
    const isValid = validate(nextDraftValues);
    if (isValid) {
      setFilterDraftValues(nextDraftValues);
      handleApply(nextDraftValues);
    }
  }

  function onActiveFilterValuesChanged(activeFilterValues: FilterValue[]) {
    setFilterDraftValues(mapActiveToDraftValues(activeFilterValues));
    setActiveValues(activeFilterValues);
    onValuesSubmit(activeFilterValues);
  }

  const setOnActiveFilterValuesChangedCallback = useCallback(
    (callback: (filterValues: FilterValue[]) => void) => {
      setActiveValuesCallback({ callback: callback });
    },
    [setActiveValuesCallback],
  );

  const filterButtonProps: FilterButtonProps = {
    onClick: () => setFilterSettingsVisible((prev) => !prev),
    activeFilters: activeValues.length,
    isFilterVisible: filterSettingsVisible,
    "aria-controls": filterSettingsId,
  };

  const activeFilterProps: ActiveFilterProps = {
    filterValues: activeValues,
    deleteFilterValue: handleDelete,
    deleteAllFilterValues: handleDeleteAll,
    maxVisible: 5,
    getFilterValueLabel: ({ key }) => findDefinition(key, definitions)?.name,
  };

  const filterSettingsProps: FilterSettingsProps = {
    definitions,
    draftValues: draftValues,
    onDraftValueChange: handleDraftValueChange,
    showActiveFilters: activeValues.length > 0,
    showSearch: showSearch,
    activeFilterProps,
  };

  const filterSettingsSheetProps: FilterSettingsSheetProps = {
    onApply: () => {
      const isValid = validate(draftValues);

      if (isValid) {
        handleApply(draftValues);
      }
    },
    isDirty: !isDeepEqual(mapDraftToActiveValues(draftValues), activeValues),
    scalingWidth,
    id: filterSettingsId,
    errorMessages,
  };

  return {
    activeValues,
    filterSettingsVisible,
    filterButtonProps,
    filterSettingsProps,
    filterSettingsSheetProps,
    onActiveFilterValuesChanged,
    setOnActiveFilterValuesChangedCallback,
  };
}

function findDefinition(key: string, definitions: FilterDefinition[]) {
  return definitions.find((definition) => definition.key === key)!;
}
