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
  const { t } = useTranslation("schoolEntry/nav");
  return [
    {
      name: t("school_entry_title"),
      subItems: [
        {
          name: t("person.overview_link"),
          href: citizenRoutes.overview,
          icon: StickyNote2Outlined,
        },
      ],
    },
  ];
}

export function useOrganizationNavigationItems(): NavigationItem[] {
  return [];
}
