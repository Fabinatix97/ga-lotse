/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { StickyNote2Outlined } from "@mui/icons-material";

import { NavigationItem } from "@/lib/baseModule/components/layout/types";
import { useTranslation } from "@/lib/i18n/client";

import { useCitizenRoutes } from "./routes";

export function useCitizenNavigationItems(): NavigationItem[] {
  const citizenRoutes = useCitizenRoutes();
  const { t } = useTranslation("stiProtection/nav");
  return [
    {
      name: t("sti_protection_title"),
      subItems: [
        {
          name: t("landing.sti_consultation_title"),
          href: citizenRoutes.stiConsultation.index,
          icon: StickyNote2Outlined,
        },
        {
          name: t("landing.sex_work_title"),
          href: citizenRoutes.sexWork.index,
          icon: StickyNote2Outlined,
        },
      ],
    },
  ];
}

export function useOrganizationNavigationItems(): NavigationItem[] {
  return [];
}
