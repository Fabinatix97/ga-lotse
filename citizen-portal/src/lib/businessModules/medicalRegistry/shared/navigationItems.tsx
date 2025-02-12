/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMedicalRegistryFeature } from "@eshg/medical-registry-api";
import { StickyNote2Outlined } from "@mui/icons-material";

import { NavigationItem } from "@/lib/baseModule/components/layout/types";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/medicalRegistry/api/queries/featureTogglesApi";
import { useTranslation } from "@/lib/i18n/client";

import { CitizenRoutes, useCitizenRoutes } from "./routes";

export function useCitizenNavigationItems(): NavigationItem[] {
  const citizenRoutes: CitizenRoutes = useCitizenRoutes();
  const { t } = useTranslation("medicalRegistry/nav");

  try {
    const citizenPortalEnabled = useIsNewFeatureEnabled(
      ApiMedicalRegistryFeature.CitizenPortalEnabled,
    );

    return citizenPortalEnabled
      ? [
          {
            name: t("medicalRegistryTitle"),
            subItems: [
              {
                name: t("person.home"),
                href: citizenRoutes.home,
                icon: StickyNote2Outlined,
              },
            ],
          },
        ]
      : [];
  } catch {
    return [];
  }
}

export function useOrganizationNavigationItems(): NavigationItem[] {
  return [];
}
