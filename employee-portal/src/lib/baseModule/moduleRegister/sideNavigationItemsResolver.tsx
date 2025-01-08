/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SideNavItemGroups,
  SideNavigationItem,
  UseSideNavigationItemsResult,
} from "@/lib/baseModule/components/layout/sideNavigation/types";
import {
  useSideNavigationItems as useBaseSideNavigationItems,
  useDashboardItem,
} from "@/lib/baseModule/sideNavigationItems";
import { useSideNavigationItems as useChatSideNavigationItems } from "@/lib/businessModules/chat/shared/sideNavigationItem";
import { useSideNavigationItems as useDentalSideNavigationItems } from "@/lib/businessModules/dental/shared/sideNavigationItem";
import { useSideNavigationItems as useInspectionSideNavigationItems } from "@/lib/businessModules/inspection/shared/sideNavigationItem";
import { useSideNavigationItems as useMeaslesProtectionSideNavigationItems } from "@/lib/businessModules/measlesProtection/shared/sideNavigationItem";
import { useSideNavigationItems as useMedicalRegistrySideNavigationItems } from "@/lib/businessModules/medicalRegistry/shared/sideNavigationItem";
import { useSideNavigationItems as useOfficialMedicalServiceSideNavigationItems } from "@/lib/businessModules/officialMedicalService/shared/sideNavigationItem";
import { useSideNavigationItems as useSchoolEntrySideNavigationItems } from "@/lib/businessModules/schoolEntry/shared/sideNavigationItem";
import { useSideNavigationItems as useStatisticsSideNavigationItems } from "@/lib/businessModules/statistics/shared/sideNavigationItem";
import { useSideNavigationItems as useStiProtectionSideNavigationItems } from "@/lib/businessModules/stiProtection/shared/sideNavigationItem";
import { useSideNavigationItems as useTravelMedicineSideNavigationItems } from "@/lib/businessModules/travelMedicine/shared/sideNavigationItem";
import { sideNavigationItems as archivingSideNavigationItems } from "@/lib/shared/components/archiving/shared/sideNavigationItem";

interface UseSideNavigationItemGroupsResult {
  isLoading: boolean;
  itemGroups: SideNavItemGroups;
}

export function useResolveSideNavigationItems(): UseSideNavigationItemGroupsResult {
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
  const dashboardItem = useDashboardItem();
  const baseSideNavigation = useBaseSideNavigationItems();
  const dentalSideNavigationItems = useDentalSideNavigationItems();
  const officialMedicalServiceSideNavigationItems =
    useOfficialMedicalServiceSideNavigationItems();

  const orderedSideNavigationItems: UseSideNavigationItemsResult[] = [
    schoolEntrySideNavigation,
    inspectionSideNavigation,
    travelMedicineSideNavigation,
    measlesProtectionSideNavigation,
    stiProtectionSideNavigation,
    medicalRegistrySideNavigationItems,
    dentalSideNavigationItems,
    officialMedicalServiceSideNavigationItems,
  ];

  const orderedBaseItems: UseSideNavigationItemsResult[] = [
    baseSideNavigation,
    statisticsSideNavigation,
    { isLoading: false, items: archivingSideNavigationItems },
    chatSideNavigation,
  ];

  return {
    isLoading: orderedSideNavigationItems.some(isLoading),
    itemGroups: {
      dashboardItem: dashboardItem.map(getItems).flat(),
      businessItems: orderedSideNavigationItems.map(getItems).flat(),
      baseItems: orderedBaseItems.map(getItems).flat(),
    },
  };
}

function isLoading(result: UseSideNavigationItemsResult): boolean {
  return result.isLoading;
}

function getItems(result: UseSideNavigationItemsResult): SideNavigationItem[] {
  return result.items;
}
