/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createContext, useContext } from "react";

/** Indicates if the side navigation is collapsed (true) or expanded (false). */
type NavigationListContextValue = boolean;

export const NavigationListContext =
  createContext<NavigationListContextValue | null>(null);

export function useNavigationListContext(): NavigationListContextValue {
  const collapsed = useContext(NavigationListContext);

  if (collapsed === null) {
    throw new Error("Missing NavigationListContext");
  }

  return collapsed;
}
