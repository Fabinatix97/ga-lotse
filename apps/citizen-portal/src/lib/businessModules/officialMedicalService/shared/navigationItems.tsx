/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { StickyNote2Outlined } from "@mui/icons-material";

import { NavigationItem } from "@/lib/baseModule/components/layout/types";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useTranslation } from "@/lib/i18n/client";

export function useCitizenNavigationItems(): NavigationItem[] {
  const citizenRoutes = useCitizenRoutes();
  const { t } = useTranslation("officialMedicalService/nav");
  return [
    {
      name: t("oms_title"),
      subItems: [
        {
          name: t("overview_link"),
          href: citizenRoutes.overview,
          icon: StickyNote2Outlined,
        },
      ],
    },
  ];
}
