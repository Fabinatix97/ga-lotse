/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Dispatch, SetStateAction, createContext, useContext } from "react";

interface CollapsedNavigationListContextValue {
  openMenuItemName: string | null;
  setOpenMenuItemName: Dispatch<SetStateAction<string | null>>;
}

export const CollapsedNavigationListContext =
  createContext<CollapsedNavigationListContextValue | null>(null);

export function useCollapsedNavigationListContext(): CollapsedNavigationListContextValue {
  const value = useContext(CollapsedNavigationListContext);

  if (value === null) {
    throw new Error("Missing CollapsedNavigationListContext");
  }

  return value;
}
