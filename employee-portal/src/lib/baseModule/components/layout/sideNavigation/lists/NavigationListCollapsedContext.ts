/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Dispatch, SetStateAction, createContext } from "react";

interface NavigationListCollapsedContextValue {
  openMenuItemName: string | null;
  setOpenMenuItemName: Dispatch<SetStateAction<string | null>>;
}

export const NavigationListCollapsedContext =
  createContext<NavigationListCollapsedContextValue>(null!);
