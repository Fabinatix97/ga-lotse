/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext } from "react";

import { RequiresChildren } from "../../types/react";

export const DisabledFormContext = createContext(false);

interface DisabledFormProviderProps extends RequiresChildren {
  disabled: boolean;
}

export function useIsFormDisabled() {
  return useContext(DisabledFormContext);
}

export function DisabledFormProvider(props: DisabledFormProviderProps) {
  return (
    <DisabledFormContext.Provider value={props.disabled}>
      {props.children}
    </DisabledFormContext.Provider>
  );
}
