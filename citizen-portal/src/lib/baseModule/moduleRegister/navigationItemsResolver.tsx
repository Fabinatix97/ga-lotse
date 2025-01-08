/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/citizen-portal-api/base";

import { NavigationItem } from "@/lib/baseModule/components/layout/types";
import {
  useCitizenNavigationItems as useBaseCitizenNavigationItems,
  useOrganizationNavigationItems as useBaseOrganizationCitizenNavigationItems,
} from "@/lib/baseModule/shared/navigationItems";
import { useOrganizationNavigationItems as useMeaslesProtectionOrganizationNavigationItems } from "@/lib/businessModules/measlesProtection/shared/navigationItems";
import {
  useCitizenNavigationItems as useMedicalRegistryCitizenNavigationItems,
  useOrganizationNavigationItems as useMedicalRegistryOrganizationNavigationItems,
} from "@/lib/businessModules/medicalRegistry/shared/navigationItems";
import { useCitizenNavigationItems as useOfficialMedicalServcieNavigationItems } from "@/lib/businessModules/officialMedicalService/shared/navigationItems";
import {
  useCitizenNavigationItems as useSchoolEntryCitizenNavigationItems,
  useOrganizationNavigationItems as useSchoolEntryOrganizationNavigationItems,
} from "@/lib/businessModules/schoolEntry/shared/navigationItems";
import {
  useCitizenNavigationItems as useTravelMedicineCitizenNavigationItems,
  useOrganizationNavigationItems as useTravelMedicineOrganizationNavigationItems,
} from "@/lib/businessModules/travelMedicine/shared/navigationItems";
import { useHasBusinessModule } from "@/lib/shared/hooks/useHasBusinessModule";

export function useResolveCitizenNavigationItems(): NavigationItem[] {
  const hasBusinessModule = useHasBusinessModule();
  const schoolEntryCitizenNavigationItems =
    useSchoolEntryCitizenNavigationItems();
  const travelMedicineCitizenNavigationItems =
    useTravelMedicineCitizenNavigationItems();
  const officialMedicalServcieNavigationItems =
    useOfficialMedicalServcieNavigationItems();
  const medicalRegistryCitizenNavigationItems =
    useMedicalRegistryCitizenNavigationItems();
  const navigationItems = useBaseCitizenNavigationItems();

  if (hasBusinessModule(ApiBusinessModule.SchoolEntry)) {
    navigationItems.push(...schoolEntryCitizenNavigationItems);
  }
  if (hasBusinessModule(ApiBusinessModule.TravelMedicine)) {
    navigationItems.push(...travelMedicineCitizenNavigationItems);
  }
  if (hasBusinessModule(ApiBusinessModule.MedicalRegistry)) {
    navigationItems.push(...medicalRegistryCitizenNavigationItems);
  }
  if (hasBusinessModule(ApiBusinessModule.OfficialMedicalService)) {
    navigationItems.push(...officialMedicalServcieNavigationItems);
  }

  return navigationItems;
}

export function useResolveOrganizationNavigationItems(): NavigationItem[] {
  const hasBusinessModule = useHasBusinessModule();
  const schoolEntryOrganizationNavigationItems =
    useSchoolEntryOrganizationNavigationItems();
  const measlesProtectionOrganizationNavigationItems =
    useMeaslesProtectionOrganizationNavigationItems();
  const travelMedicineOrganizationNavigationItems =
    useTravelMedicineOrganizationNavigationItems();
  const medicalRegistryOrganizationNavigationItems =
    useMedicalRegistryOrganizationNavigationItems();
  const navigationItems = useBaseOrganizationCitizenNavigationItems();

  if (hasBusinessModule(ApiBusinessModule.SchoolEntry)) {
    navigationItems.push(...schoolEntryOrganizationNavigationItems);
  }
  if (hasBusinessModule(ApiBusinessModule.MeaslesProtection)) {
    navigationItems.push(...measlesProtectionOrganizationNavigationItems);
  }
  if (hasBusinessModule(ApiBusinessModule.TravelMedicine)) {
    navigationItems.push(...travelMedicineOrganizationNavigationItems);
  }
  if (hasBusinessModule(ApiBusinessModule.MedicalRegistry)) {
    navigationItems.push(...medicalRegistryOrganizationNavigationItems);
  }

  return navigationItems;
}
