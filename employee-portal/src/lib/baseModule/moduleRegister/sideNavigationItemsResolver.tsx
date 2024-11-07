/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SideNavigationItem,
  UseSideNavigationItemsResult,
} from "@/lib/baseModule/components/layout/sideNavigation/types";
import { useSideNavigationItems as useBaseSideNavigationItems } from "@/lib/baseModule/sideNavigationItems";
import { useSideNavigationItems as useChatSideNavigationItems } from "@/lib/businessModules/chat/shared/sideNavigationItem";
import { useSideNavigationItems as useInspectionSideNavigationItems } from "@/lib/businessModules/inspection/shared/sideNavigationItem";
import { useSideNavigationItems as useMeaslesProtectionSideNavigationItems } from "@/lib/businessModules/measlesProtection/shared/sideNavigationItem";
import { useSideNavigationItems as useMedicalRegistrySideNavigationItems } from "@/lib/businessModules/medicalRegistry/shared/sideNavigationItem";
import { useSideNavigationItems as useSchoolEntrySideNavigationItems } from "@/lib/businessModules/schoolEntry/shared/sideNavigationItem";
import { useSideNavigationItems as useStatisticsSideNavigationItems } from "@/lib/businessModules/statistics/shared/sideNavigationItem";
import { useSideNavigationItems as useStiProtectionSideNavigationItems } from "@/lib/businessModules/stiProtection/shared/sideNavigationItem";
import { useSideNavigationItems as useTravelMedicineSideNavigationItems } from "@/lib/businessModules/travelMedicine/shared/sideNavigationItem";
import { sideNavigationItems as archivingSideNavigationItems } from "@/lib/shared/components/archiving/shared/sideNavigationItem";

export function useResolveSideNavigationItems(): UseSideNavigationItemsResult {
  const inspectionSideNavigation = useInspectionSideNavigationItems();
  const schoolEntrySideNavigation = useSchoolEntrySideNavigationItems();
  const travelMedicineSideNavigation = useTravelMedicineSideNavigationItems();
  const measlesProtectionSideNavigation =
    useMeaslesProtectionSideNavigationItems();
  const stiProtectionSideNavigation = useStiProtectionSideNavigationItems();
  const medicalRegistrySideNavigationItems =
    useMedicalRegistrySideNavigationItems();
  const statisticsSideNavigation = useStatisticsSideNavigationItems();
  const chatSideNavigation = useChatSideNavigationItems();
  const baseSideNavigation = useBaseSideNavigationItems();

  const orderedSideNavigationItems: UseSideNavigationItemsResult[] = [
    baseSideNavigation,
    inspectionSideNavigation,
    schoolEntrySideNavigation,
    travelMedicineSideNavigation,
    measlesProtectionSideNavigation,
    stiProtectionSideNavigation,
    medicalRegistrySideNavigationItems,
    statisticsSideNavigation,
    { isLoading: false, items: archivingSideNavigationItems },
    chatSideNavigation,
  ];

  return {
    isLoading: orderedSideNavigationItems.some(isLoading),
    items: orderedSideNavigationItems.map(getItems).flat(),
  };
}

function isLoading(result: UseSideNavigationItemsResult): boolean {
  return result.isLoading;
}

function getItems(result: UseSideNavigationItemsResult): SideNavigationItem[] {
  return result.items;
}
