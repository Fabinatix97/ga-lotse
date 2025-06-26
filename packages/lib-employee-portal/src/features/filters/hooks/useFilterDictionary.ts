/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { startTransition, useEffect, useId, useState } from "react";
import { isDefined } from "remeda";

import { useSessionPersistence } from "../../../contexts/sessionPersistence";
import { ActiveFilter } from "../components/filterSettings/ActiveFilter";
import { FilterSettingsSheetProps } from "../components/filterSettings/FilterSettingsSheet";
import { ToggleFilterButtonProps } from "../components/filterSettings/ToggleFilterButton";

type FilterDictionary<TKey extends string> = Partial<Record<TKey, unknown>>;

export type SetDictionaryFilterFn<
  TKey extends string,
  TFilters extends FilterDictionary<TKey>,
> = ReturnType<
  typeof useFilterDictionary<TKey, TFilters>
>["setFilterFormValue"];

export function usePersistentFilterDictionary<
  TKey extends string,
  TFilters extends FilterDictionary<TKey>,
>(props: { key: string; onChangeFilters?: () => void }) {
  const sessionPersistence = useSessionPersistence<TFilters>({
    key: props.key,
    initialValue: {} as TFilters,
  });

  const filterDictionary = useFilterDictionary<TKey, TFilters>({
    initialFilters: sessionPersistence.get(),
    onChangeFilters: props.onChangeFilters,
  });

  useEffect(() => {
    sessionPersistence.set(filterDictionary.filterValues);
  }, [filterDictionary.filterValues, sessionPersistence]);

  return filterDictionary;
}

export function useFilterDictionary<
  TKey extends string,
  TFilters extends FilterDictionary<TKey>,
>(props: { initialFilters?: TFilters; onChangeFilters?: () => void }) {
  interface FilterDictionaryState {
    filterValues: TFilters;
    filterFormValues: TFilters;
    isDirty: boolean;
  }

  const initialFilters = props.initialFilters ?? ({} as TFilters);
  const [state, setState] = useState<FilterDictionaryState>({
    filterValues: initialFilters,
    filterFormValues: initialFilters,
    isDirty: false,
  });
  const filtersId = useId();

  function updateState(stateChanges: Partial<FilterDictionaryState>): void {
    setState((prevState) => ({
      ...prevState,
      ...stateChanges,
    }));
  }

  function updateAndApplyStateDeferred(
    stateChanges: Partial<FilterDictionaryState>,
  ): void {
    // defer state update to trigger table loading animation instead of Suspense fallback
    startTransition(() => {
      updateState(stateChanges);
      if (isDefined(props.onChangeFilters)) {
        props.onChangeFilters();
      }
    });
  }

  function setFilterFormValue(name: TKey, value: TFilters[TKey] | undefined) {
    if (state.filterFormValues[name] === value) {
      return;
    }
    // update form values immediately to prevent flakiness
    updateState({
      filterFormValues: { ...state.filterFormValues, [name]: value },
      isDirty: true,
    });
  }

  function deleteFilterValue(name: TKey) {
    updateAndApplyStateDeferred({
      filterValues: { ...state.filterValues, [name]: undefined },
      filterFormValues: { ...state.filterFormValues, [name]: undefined },
    });
  }

  function clearFilterValues() {
    updateAndApplyStateDeferred({
      filterValues: {} as TFilters,
      filterFormValues: {} as TFilters,
      isDirty: false,
    });
  }

  function handleApply() {
    updateAndApplyStateDeferred({
      filterValues: state.filterFormValues,
      isDirty: false,
    });
  }

  const filterSettingsSheetProps: FilterSettingsSheetProps = {
    id: filtersId,
    onApply: handleApply,
    isDirty: state.isDirty,
    filterSettingsVisible: true,
  };

  function getActiveFilters(filters: TFilters) {
    return Object.entries(filters)
      .filter(([_, value]) => isDefined(value))
      .map(([key]) => ({ key })) as ActiveFilter<TKey>[];
  }

  const activeFilters: ActiveFilter<TKey>[] = getActiveFilters(
    state.filterValues,
  );

  const filterButtonProps: ToggleFilterButtonProps = {
    activeFilters: activeFilters.length,
    "aria-controls": filtersId,
  };

  return {
    filterValues: state.filterValues,
    filterFormValues: state.filterFormValues,
    setFilterFormValue,
    deleteFilterValue,
    clearFilterValues,
    filterButtonProps,
    filterSettingsSheetProps,
    activeFilters,
  };
}
