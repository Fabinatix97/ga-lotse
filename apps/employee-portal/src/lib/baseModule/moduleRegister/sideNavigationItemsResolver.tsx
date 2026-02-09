/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { entries } from "remeda";

import { ApiBusinessModule } from "@eshg/base-api";
import { resolveSideNavigationItems as resolveDentalSideNavigationItems } from "@eshg/dental";
import { resolveSideNavigationItems as resolveInfectionBriefingSideNavigationItems } from "@eshg/infection-briefing";
import {
  SideNavigationItem,
  SideNavigationItemsProps,
  useArchivingSideNavigationItems,
  useGetPublicConfig,
} from "@eshg/lib-employee-portal";
import { resolveSideNavigationItems as resolveProstituteProtectionSideNavigationItems } from "@eshg/prostitute-protection";

import { SideNavItemGroups } from "@/lib/baseModule/components/layout/sideNavigation/types";
import { useSideNavigationItemProps } from "@/lib/baseModule/components/layout/sideNavigation/useSideNavigationItemProps";
import {
  dashboardItem,
  useSideNavigationItems as useBaseSideNavigationItems,
} from "@/lib/baseModule/sideNavigationItem";
import { useSideNavigationItems as useChatSideNavigationItems } from "@/lib/businessModules/chat/shared/sideNavigationItem";
import { resolveSideNavigationItems as resolveInspectionSideNavigationItems } from "@/lib/businessModules/inspection/shared/sideNavigationItem";
import { resolveSideNavigationItems as resolveMeaslesProtectionSideNavigationItems } from "@/lib/businessModules/measlesProtection/shared/sideNavigationItem";
import { resolveSideNavigationItems as resolveMedicalRegistrySideNavigationItems } from "@/lib/businessModules/medicalRegistry/shared/sideNavigationItem";
import { resolveSideNavigationItems as resolveOfficialMedicalServiceSideNavigationItems } from "@/lib/businessModules/officialMedicalService/shared/sideNavigationItem";
import { resolveSideNavigationItems as resolveSchoolEntrySideNavigationItems } from "@/lib/businessModules/schoolEntry/shared/sideNavigationItem";
import { sideNavigationItems as statisticsSideNavigationItems } from "@/lib/businessModules/statistics/shared/sideNavigationItem";
import { resolveSideNavigationItems as resolveStiProtectionSideNavigationItems } from "@/lib/businessModules/stiProtection/shared/sideNavigationItem";
import { resolveSideNavigationItems as resolveTravelMedicineSideNavigationItems } from "@/lib/businessModules/travelMedicine/shared/sideNavigationItem";
import { resolveConfiguratorSideNavigationItems } from "@/lib/configurator/shared/sideNavigationItem";

type ResolveSideNavigationItems = (
  params: SideNavigationItemsProps,
) => SideNavigationItem[];

const businessItemResolvers: Record<
  ApiBusinessModule,
  ResolveSideNavigationItems
> = {
  [ApiBusinessModule.SchoolEntry]: resolveSchoolEntrySideNavigationItems,
  [ApiBusinessModule.Inspection]: resolveInspectionSideNavigationItems,
  [ApiBusinessModule.TravelMedicine]: resolveTravelMedicineSideNavigationItems,
  [ApiBusinessModule.MeaslesProtection]:
    resolveMeaslesProtectionSideNavigationItems,
  [ApiBusinessModule.StiProtection]: resolveStiProtectionSideNavigationItems,
  [ApiBusinessModule.MedicalRegistry]:
    resolveMedicalRegistrySideNavigationItems,
  [ApiBusinessModule.Dental]: resolveDentalSideNavigationItems,
  [ApiBusinessModule.OfficialMedicalService]:
    resolveOfficialMedicalServiceSideNavigationItems,
  [ApiBusinessModule.MedsAbroad]: () => [],
  [ApiBusinessModule.ProstituteProtection]:
    resolveProstituteProtectionSideNavigationItems,
  [ApiBusinessModule.InfectionBriefing]:
    resolveInfectionBriefingSideNavigationItems,
};

function useBusinessItems(): SideNavigationItem[] {
  const { data: config } = useGetPublicConfig();
  const activeModules = config.activeModules;
  const resolveParams = useSideNavigationItemProps();

  return entries(businessItemResolvers)
    .filter(([module]) => activeModules.includes(module))
    .map(([_, resolveSideNavigationItems]) => {
      return resolveSideNavigationItems(resolveParams);
    })
    .flat();
}

function useBaseItems(): SideNavigationItem[] {
  const chatSideNavigations = useChatSideNavigationItems();
  const baseSideNavigations = useBaseSideNavigationItems();
  const archivingSideNavigationItems = useArchivingSideNavigationItems();
  const configurationSideNavigations = resolveConfiguratorSideNavigationItems();

  const baseItems: SideNavigationItem[][] = [
    baseSideNavigations,
    statisticsSideNavigationItems,
    archivingSideNavigationItems,
    chatSideNavigations,
    configurationSideNavigations,
  ];

  return baseItems.flat();
}

export function useResolveSideNavigationItems(): SideNavItemGroups {
  const businessItems = useBusinessItems();
  const baseItems = useBaseItems();

  return {
    dashboardItem: [dashboardItem],
    businessItems,
    baseItems,
  };
}
