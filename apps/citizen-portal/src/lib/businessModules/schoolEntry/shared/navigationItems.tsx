/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ModuleCategory,
  ModuleNavigationItem,
} from "@/lib/baseModule/components/layout/types";
import { useTranslation } from "@/lib/i18n/client";

import { useCitizenRoutes } from "./routes";

export function useCitizenNavigationItem(): ModuleNavigationItem {
  const citizenRoutes = useCitizenRoutes();
  const { t } = useTranslation("schoolEntry/nav");
  return {
    category: ModuleCategory.ChildAndYouthHealth,
    navigationItem: {
      name: t("title"),
      href: citizenRoutes.overview,
    },
  };
}
