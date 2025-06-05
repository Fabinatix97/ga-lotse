/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InfoOutlined } from "@mui/icons-material";

import { NavigationItem } from "@/lib/baseModule/components/layout/types";
import { useTranslation } from "@/lib/i18n/client";

import { useCitizenRoutes } from "./routes";

export function useCitizenNavigationItems(): NavigationItem[] {
  const citizenRoutes = useCitizenRoutes();
  const { t } = useTranslation("medsAbroad/nav");

  return [
    {
      name: t("tab_title"),
      subItems: [
        {
          name: t("sub_items.information"),
          href: citizenRoutes.information,
          icon: InfoOutlined,
        },
      ],
    },
  ];
}
