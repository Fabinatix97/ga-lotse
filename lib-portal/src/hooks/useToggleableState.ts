/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useReducer } from "react";

/**
 * Calling the dispatch function twice with the same argument results in
 * the state being set to `undefined`.
 * This makes it possible to toggle one state on and off or set a new state.
 */
export function useToggleableState<TPanelName>(initialState?: TPanelName) {
  function reduceToggleableState(
    state: TPanelName | undefined,
    newState: TPanelName | undefined,
  ): TPanelName | undefined {
    return newState === state ? undefined : newState;
  }

  return useReducer(reduceToggleableState, initialState);
}
