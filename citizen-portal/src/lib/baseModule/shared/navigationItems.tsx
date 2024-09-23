/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NavigationItem } from "@/lib/baseModule/components/layout/types";

/**
 * These are the navigation items of base module pages.
 * Navigation items of business module pages are defined in their respective files and must not be added here.
 */
export function useCitizenNavigationItems(): NavigationItem[] {
  return [];
}

export function useOrganizationNavigationItems(): NavigationItem[] {
  return [];
}
