/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ModuleCategory,
  ModuleNavigationItem,
} from "@/lib/baseModule/components/layout/types";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";

export function useCitizenNavigationItem(): ModuleNavigationItem {
  const citizenRoutes = useCitizenRoutes();
  const { t } = useTranslation("travelMedicine/nav");
  return {
    category: ModuleCategory.InfectiousDiseases,
    navigationItem: {
      name: t("title"),
      href: citizenRoutes.overview,
    },
  };
}
