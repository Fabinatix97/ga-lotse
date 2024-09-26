/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SideNavigationItem } from "@/lib/baseModule/components/layout/sideNavigation/types";
import { useSideNavigationItems as useBaseSideNavigationItems } from "@/lib/baseModule/sideNavigationItems";
import { useSideNavigationItems as useChatSideNavigationItems } from "@/lib/businessModules/chat/shared/sideNavigationItem";
import { useSideNavigationItems as useInspectionSideNavigationItems } from "@/lib/businessModules/inspection/shared/sideNavigationItem";
import { useSideNavigationItems as useMeaslesProtectionSideNavigationItems } from "@/lib/businessModules/measlesProtection/shared/sideNavigationItem";
import { useSideNavigationItems as useSchoolEntrySideNavigationItems } from "@/lib/businessModules/schoolEntry/shared/sideNavigationItem";
import { useSideNavigationItems as useStatisticsSideNavigationItems } from "@/lib/businessModules/statistics/shared/sideNavigationItem";
import { useSideNavigationItems as useStiProtectionSideNavigationItems } from "@/lib/businessModules/stiProtection/shared/sideNavigationItem";
import { useSideNavigationItems as useTravelMedicineSideNavigationItems } from "@/lib/businessModules/travelMedicine/shared/sideNavigationItem";
import { sideNavigationItems as archivingSideNavigationItems } from "@/lib/shared/components/archiving/shared/sideNavigationItem";

export function useResolveSideNavigationItems(): SideNavigationItem[] {
  const inspectionSideNavigationItems = useInspectionSideNavigationItems();
  const schoolEntrySideNavigationItems = useSchoolEntrySideNavigationItems();
  const travelMedicineSideNavigationItems =
    useTravelMedicineSideNavigationItems();
  const measlesProtectionSideNavigationItems =
    useMeaslesProtectionSideNavigationItems();
  const stiProtectionSideNavigationItems =
    useStiProtectionSideNavigationItems();
  const statisticsSideNavigationItems = useStatisticsSideNavigationItems();
  const chatSideNavigationItems = useChatSideNavigationItems();
  const baseSideNavigationItems = useBaseSideNavigationItems();

  const businessModuleSideNavigationItems: SideNavigationItem[] = [
    ...inspectionSideNavigationItems,
    ...schoolEntrySideNavigationItems,
    ...travelMedicineSideNavigationItems,
    ...measlesProtectionSideNavigationItems,
    ...stiProtectionSideNavigationItems,
    ...statisticsSideNavigationItems,
    ...archivingSideNavigationItems,
    ...chatSideNavigationItems,
  ];
  return [...baseSideNavigationItems, ...businessModuleSideNavigationItems];
}
