/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/base-api";

import {
  ModuleCategory,
  ModuleNavigationItem,
  NavigationItem,
} from "@/lib/baseModule/components/layout/types";
import { useOrganizationNavigationItem as useMeaslesProtectionOrganizationNavigationItem } from "@/lib/businessModules/measlesProtection/shared/navigationItems";
import { useCitizenNavigationItem as useMedicalRegistryCitizenNavigationItem } from "@/lib/businessModules/medicalRegistry/shared/navigationItems";
import { useCitizenNavigationItem as useOfficialMedicalServiceNavigationItem } from "@/lib/businessModules/officialMedicalService/shared/navigationItems";
import { useProstituteProtectionCitizenNavigationItem } from "@/lib/businessModules/prostituteProtection/shared/navigationItems";
import { useCitizenNavigationItem as useSchoolEntryCitizenNavigationItem } from "@/lib/businessModules/schoolEntry/shared/navigationItems";
import { useCitizenNavigationItem as useStiProtectionCitizenNavigationItem } from "@/lib/businessModules/stiProtection/shared/navigationItems";
import { useCitizenNavigationItem as useTravelMedicineCitizenNavigationItem } from "@/lib/businessModules/travelMedicine/shared/navigationItems";
import { useTranslation } from "@/lib/i18n/client";
import { useHasBusinessModule } from "@/lib/shared/hooks/useHasBusinessModule";

export function useResolveCitizenNavigationItems(): NavigationItem[] {
  const hasBusinessModule = useHasBusinessModule();
  const { t } = useTranslation("header");
  const schoolEntryCitizenNavigationItem =
    useSchoolEntryCitizenNavigationItem();
  const travelMedicineCitizenNavigationItem =
    useTravelMedicineCitizenNavigationItem();
  const medicalRegistryCitizenNavigationItem =
    useMedicalRegistryCitizenNavigationItem();
  const officialMedicalServiceNavigationItem =
    useOfficialMedicalServiceNavigationItem();
  const prostituteProtectionCitizenNavigationItem =
    useProstituteProtectionCitizenNavigationItem();
  const stiProtectionCitizenNavigationItem =
    useStiProtectionCitizenNavigationItem();

  const topicNavigation = new TopicNavigation(t);

  if (hasBusinessModule(ApiBusinessModule.SchoolEntry)) {
    topicNavigation.addItem(schoolEntryCitizenNavigationItem);
  }
  if (hasBusinessModule(ApiBusinessModule.TravelMedicine)) {
    topicNavigation.addItem(travelMedicineCitizenNavigationItem);
  }
  if (hasBusinessModule(ApiBusinessModule.MedicalRegistry)) {
    topicNavigation.addItem(medicalRegistryCitizenNavigationItem);
  }
  if (hasBusinessModule(ApiBusinessModule.OfficialMedicalService)) {
    topicNavigation.addItem(officialMedicalServiceNavigationItem);
  }
  if (hasBusinessModule(ApiBusinessModule.ProstituteProtection)) {
    topicNavigation.addItem(prostituteProtectionCitizenNavigationItem);
  }
  if (hasBusinessModule(ApiBusinessModule.StiProtection)) {
    topicNavigation.addItem(stiProtectionCitizenNavigationItem);
  }

  return topicNavigation.getItems();
}

export function useResolveOrganizationNavigationItems(): NavigationItem[] {
  const hasBusinessModule = useHasBusinessModule();
  const { t } = useTranslation("header");
  const topicNavigation = new TopicNavigation(t);
  const measlesProtectionOrganizationNavigationItem =
    useMeaslesProtectionOrganizationNavigationItem();

  if (hasBusinessModule(ApiBusinessModule.MeaslesProtection)) {
    topicNavigation.addItem(measlesProtectionOrganizationNavigationItem);
  }

  return topicNavigation.getItems();
}

class TopicNavigation {
  private static orderedCategories = [
    ModuleCategory.ChildAndYouthHealth,
    ModuleCategory.InfectiousDiseases,
    ModuleCategory.MentalHealth,
    ModuleCategory.Hygiene,
    ModuleCategory.DentalHealth,
  ];

  private readonly translateCategory: TranslateCategoryFn;
  private readonly groupedTopics = new Map<ModuleCategory, NavigationItem[]>();
  private readonly otherTopics: NavigationItem[] = [];

  public constructor(translateCategory: TranslateCategoryFn) {
    this.translateCategory = translateCategory;
  }

  public addItem(item: ModuleNavigationItem): void {
    const { category, navigationItem } = item;

    if (category === undefined) {
      this.otherTopics.push(navigationItem);
      return;
    }

    let groupedTopic = this.groupedTopics.get(category);

    if (groupedTopic === undefined) {
      groupedTopic = [];
      this.groupedTopics.set(category, groupedTopic);
    }

    groupedTopic.push(navigationItem);
  }

  public getItems(): NavigationItem[] {
    const groupedItems: NavigationItem[] = [];

    TopicNavigation.orderedCategories.forEach((category) => {
      const groupedTopic = this.groupedTopics.get(category);
      if (groupedTopic === undefined) {
        return;
      }

      groupedItems.push({
        name: this.translateCategory(`nav.${category}`),
        items: groupedTopic,
      });
    });

    return [...groupedItems, ...this.otherTopics];
  }
}

type TranslateCategoryFn = (key: string) => string;
