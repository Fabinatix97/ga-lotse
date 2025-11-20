/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ModuleNavigationItem } from "@/lib/baseModule/components/layout/types";
import { useTranslation } from "@/lib/i18n/client";

import { useCitizenRoutes } from "./routes";

export function useProstituteProtectionCitizenNavigationItem(): ModuleNavigationItem {
  const citizenRoutes = useCitizenRoutes();
  const { t } = useTranslation("prostituteProtection/nav");

  return {
    navigationItem: {
      name: t("title"),
      href: citizenRoutes.overview,
    },
  };
}
