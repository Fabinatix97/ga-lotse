/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NavigationItem } from "@/lib/baseModule/components/layout/types";
import {
  useCitizenNavigationItems as useBaseCitizenNavigationItems,
  useOrganizationNavigationItems as useBaseOrganizationCitizenNavigationItems,
} from "@/lib/baseModule/shared/navigationItems";
import { useOrganizationNavigationItems as useMeaslesProtectionOrganizationNavigationItems } from "@/lib/businessModules/measlesProtection/shared/navigationItems";
import {
  useCitizenNavigationItems as useSchoolEntryCitizenNavigationItems,
  useOrganizationNavigationItems as useSchoolEntryOrganizationNavigationItems,
} from "@/lib/businessModules/schoolEntry/shared/navigationItems";
import {
  useCitizenNavigationItems as useTravelMedicineCitizenNavigationItems,
  useOrganizationNavigationItems as useTravelMedicineOrganizationNavigationItems,
} from "@/lib/businessModules/travelMedicine/shared/navigationItems";

export function useResolveCitizenNavigationItems() {
  const businessModuleNavigationItems: NavigationItem[] = [
    ...useSchoolEntryCitizenNavigationItems(),
    ...useTravelMedicineCitizenNavigationItems(),
  ];
  return [...useBaseCitizenNavigationItems(), ...businessModuleNavigationItems];
}

export function useResolveOrganizationNavigationItems(): NavigationItem[] {
  const businessModuleNavigationItems: NavigationItem[] = [
    ...useSchoolEntryOrganizationNavigationItems(),
    ...useMeaslesProtectionOrganizationNavigationItems(),
    ...useTravelMedicineOrganizationNavigationItems(),
  ];
  return [
    ...useBaseOrganizationCitizenNavigationItems(),
    ...businessModuleNavigationItems,
  ];
}
