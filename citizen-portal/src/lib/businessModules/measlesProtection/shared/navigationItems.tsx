/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FactCheckOutlined, StickyNote2Outlined } from "@mui/icons-material";

import { NavigationItem } from "@/lib/baseModule/components/layout/types";
import { useTranslation } from "@/lib/i18n/client";

import { useRoutes } from "./routes";

export function useOrganizationNavigationItems(): NavigationItem[] {
  const routes = useRoutes();
  const { t } = useTranslation("measlesProtection/nav");
  return [
    {
      name: t("measles_protection_title"),
      subItems: [
        {
          name: t("overview_link"),
          href: routes.organizationPath.overview,
          icon: StickyNote2Outlined,
        },
        {
          name: t("org.report_form_link"),
          description: t("org.report_form_desc"),
          href: routes.organizationPath.report,
          icon: FactCheckOutlined,
        },
      ],
    },
  ];
}
