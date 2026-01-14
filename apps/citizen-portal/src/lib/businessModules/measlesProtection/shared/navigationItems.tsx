/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ModuleCategory,
  ModuleNavigationItem,
} from "@/lib/baseModule/components/layout/types";
import { useTranslation } from "@/lib/i18n/client";

import { useRoutes } from "./routes";

export function useOrganizationNavigationItem(): ModuleNavigationItem {
  const routes = useRoutes();
  const { t } = useTranslation("measlesProtection/nav");
  return {
    category: ModuleCategory.InfectiousDiseases,
    navigationItem: {
      name: t("title"),
      items: [
        {
          name: t("overview_link"),
          href: routes.organizationPath.overview,
        },
        {
          name: t("org.report_form_link"),
          href: routes.organizationPath.report,
        },
      ],
    },
  };
}
