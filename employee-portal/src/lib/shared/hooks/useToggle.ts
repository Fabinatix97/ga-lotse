/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useReducer } from "react";

export function useToggle(initialValue = false) {
  return useReducer((value) => !value, initialValue);
}
