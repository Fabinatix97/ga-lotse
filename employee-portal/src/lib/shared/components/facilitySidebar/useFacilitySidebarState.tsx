/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetReferenceFacilityResponse } from "@eshg/employee-portal-api/base";
import { useEffect, useReducer } from "react";

import { useSearchReferenceFacilitiesQuery } from "@/lib/baseModule/api/queries/facility";
import { FacilitySidebarProps } from "@/lib/shared/components/facilitySidebar/FacilitySidebar";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { FacilitySearchFormValues } from "@/lib/shared/components/facilitySidebar/search/FacilitySearchForm";

export type FacilitySidebarStage =
  | "loading"
  | "display"
  | "create"
  | "edit"
  | "search"
  | "search_results";

export interface FacilitySidebarState<TSearchValues> {
  stage: FacilitySidebarStage;
  createState?: DefaultFacilityFormValues;
  searchState: TSearchValues;
  searchResult: ApiGetReferenceFacilityResponse[];
  selectedFacility: ApiGetReferenceFacilityResponse | undefined;

  dirty: boolean;
  queryEnabled: boolean;
  backEnabled: boolean;
}

export type FacilitySidebarStateAction<TSearchValues> =
  | {
      type: "SEARCH_SUCCESS";
      results: ApiGetReferenceFacilityResponse[];
    }
  | {
      type: "SEARCH_ERROR";
    }
  | {
      type: "SELECTED";
      facility: ApiGetReferenceFacilityResponse;
    }
  | {
      type: "CREATE" | "RESET";
    }
  | {
      type: "SEARCH_START";
      inputs: TSearchValues;
    }
  | {
      type: "BACK";
      createState?: DefaultFacilityFormValues;
    };

export function defaultModeTransitions<
  TSearchValues extends FacilitySearchFormValues,
>(initialSearchValues: TSearchValues) {
  function getInitialState(): FacilitySidebarState<TSearchValues> {
    return {
      stage: "search",
      createState: undefined,
      searchState: initialSearchValues,
      searchResult: [],
      selectedFacility: undefined,
      dirty: false,
      queryEnabled: false,
      backEnabled: false,
    };
  }

  function transition(
    previous: FacilitySidebarState<TSearchValues>,
    action: FacilitySidebarStateAction<TSearchValues>,
  ): FacilitySidebarState<TSearchValues> {
    switch (action.type) {
      case "RESET":
        return getInitialState();
      case "SELECTED":
        return {
          ...previous,
          stage: "display",
          selectedFacility: action.facility,
          backEnabled: true,
        };
      case "SEARCH_SUCCESS":
        return {
          ...previous,
          stage: "search_results",
          searchResult: action.results,
          queryEnabled: false,
          backEnabled: true,
        };
      case "SEARCH_ERROR":
        return {
          ...previous,
          queryEnabled: false,
          dirty: true,
        };
      case "CREATE":
        return {
          ...previous,
          stage: "create",
          backEnabled: true,
        };
      case "SEARCH_START":
        return {
          ...previous,
          searchState: action.inputs,
          queryEnabled: true,
          createState: undefined,
        };
      case "BACK":
        switch (previous.stage) {
          case "create":
            return {
              ...previous,
              stage: "search_results",
              createState: action.createState,
            };
          case "edit":
          case "display":
            return { ...previous, stage: "search_results" };
          case "search_results":
            return { ...previous, stage: "search", backEnabled: false };
          default:
            return previous;
        }
    }
  }

  return {
    transition,
    getInitialState,
  };
}

export function importModeTransitions<
  TSearchValues extends FacilitySearchFormValues,
>(initialSearchValues: TSearchValues) {
  const {
    transition: defaultTransitions,
    getInitialState: defaultGetInitialState,
  } = defaultModeTransitions(initialSearchValues);

  function getInitialState(): FacilitySidebarState<TSearchValues> {
    return {
      ...defaultGetInitialState(),
      stage: "loading",
      queryEnabled: true,
      backEnabled: false,
    };
  }

  function transition(
    previous: FacilitySidebarState<TSearchValues>,
    action: FacilitySidebarStateAction<TSearchValues>,
  ): FacilitySidebarState<TSearchValues> {
    switch (action.type) {
      case "RESET":
        return getInitialState();
      case "SEARCH_SUCCESS":
        if (action.results.length < 1) {
          return {
            ...defaultTransitions(previous, action),
            stage: "edit",
            queryEnabled: false,
            backEnabled: false,
            dirty: false,
          };
        } else {
          return {
            ...defaultTransitions(previous, action),
            stage: "search_results",
            queryEnabled: false,
            backEnabled: false,
            dirty: false,
          };
        }
      case "CREATE":
        return {
          ...defaultTransitions(previous, action),
          stage: "edit",
          queryEnabled: false,
          backEnabled: true,
          dirty: true,
        };
      case "BACK":
        switch (previous.stage) {
          case "edit":
          case "display":
            return {
              ...previous,
              stage: "search_results",
              backEnabled: false,
              queryEnabled: true,
              dirty: false,
            };
          default:
            return previous;
        }
      default:
        return { ...defaultTransitions(previous, action), dirty: true };
    }
  }

  return { transition, getInitialState };
}

export function useFacilitySidebarState<
  TSearchValues extends FacilitySearchFormValues,
>(props: FacilitySidebarProps<TSearchValues>) {
  const initialSearchValues = (props.initialSearchInputs ?? {
    name: "",
  }) as TSearchValues;

  const { transition, getInitialState } =
    props.mode === "import"
      ? importModeTransitions(initialSearchValues)
      : defaultModeTransitions(initialSearchValues);

  const [state, dispatch] = useReducer(transition, getInitialState());

  const { data, isSuccess, isError } = useSearchReferenceFacilitiesQuery(
    {
      name: state.searchState.name,
    },
    {
      enabled: props.open && state.queryEnabled,
    },
  );

  useEffect(() => {
    if (state.queryEnabled) {
      if (isSuccess) {
        dispatch({
          type: "SEARCH_SUCCESS",
          results: data.facilities,
        });
      } else if (isError) {
        dispatch({
          type: "SEARCH_ERROR",
        });
      }
    }
  }, [data, isSuccess, isError, state.queryEnabled]);

  return { state, dispatch };
}
