/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/base-api";
import { useSideNavigationItems as useDentalSideNavigationItems } from "@eshg/dental/shared/useSideNavigationItems";
import {
  SideNavigationItem,
  UseSideNavigationItemsResult,
} from "@eshg/lib-employee-portal/types/sideNavigation";
import { mapToObj } from "remeda";

import { useServerConfig } from "@/lib/baseModule/api/queries/config";
import { SideNavItemGroups } from "@/lib/baseModule/components/layout/sideNavigation/types";
import {
  useSideNavigationItems as useBaseSideNavigationItems,
  useDashboardItem,
} from "@/lib/baseModule/sideNavigationItems";
import { useSideNavigationItems as useChatSideNavigationItems } from "@/lib/businessModules/chat/shared/sideNavigationItem";
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
  const config = useServerConfig();
  const activeModules = config.data.activeModules;
  const activeModulesMap = mapToObj(
    Object.values(ApiBusinessModule),
    (module) => [module, activeModules.includes(module)],
  );

  const inspectionSideNavigation = useInspectionSideNavigationItems(
    activeModulesMap.INSPECTION,
  );
  const schoolEntrySideNavigation = useSchoolEntrySideNavigationItems(
    activeModulesMap.SCHOOL_ENTRY,
  );
  const travelMedicineSideNavigation = useTravelMedicineSideNavigationItems(
    activeModulesMap.TRAVEL_MEDICINE,
  );
  const measlesProtectionSideNavigation =
    useMeaslesProtectionSideNavigationItems(
      activeModulesMap.MEASLES_PROTECTION,
    );
  const stiProtectionSideNavigation = useStiProtectionSideNavigationItems(
    activeModulesMap.STI_PROTECTION,
  );
  const medicalRegistrySideNavigationItems =
    useMedicalRegistrySideNavigationItems(activeModulesMap.MEDICAL_REGISTRY);
  const statisticsSideNavigation = useStatisticsSideNavigationItems();
  const chatSideNavigation = useChatSideNavigationItems();
  const dashboardItem = useDashboardItem();
  const baseSideNavigation = useBaseSideNavigationItems();
  const dentalSideNavigationItems = useDentalSideNavigationItems(
    activeModulesMap.DENTAL,
  );
  const officialMedicalServiceSideNavigationItems =
    useOfficialMedicalServiceSideNavigationItems(
      activeModulesMap.OFFICIAL_MEDICAL_SERVICE,
    );

  const businessModules: [ApiBusinessModule, UseSideNavigationItemsResult][] = [
    [ApiBusinessModule.SchoolEntry, schoolEntrySideNavigation],
    [ApiBusinessModule.Inspection, inspectionSideNavigation],
    [ApiBusinessModule.TravelMedicine, travelMedicineSideNavigation],
    [ApiBusinessModule.MeaslesProtection, measlesProtectionSideNavigation],
    [ApiBusinessModule.StiProtection, stiProtectionSideNavigation],
    [ApiBusinessModule.MedicalRegistry, medicalRegistrySideNavigationItems],
    [ApiBusinessModule.Dental, dentalSideNavigationItems],
    [
      ApiBusinessModule.OfficialMedicalService,
      officialMedicalServiceSideNavigationItems,
    ],
  ];
  const orderedSideNavigationItems: UseSideNavigationItemsResult[] =
    businessModules
      .filter(([module]) => activeModulesMap[module])
      .map(([_, items]) => items);

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
