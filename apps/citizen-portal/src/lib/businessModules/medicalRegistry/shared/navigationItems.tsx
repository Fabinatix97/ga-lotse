/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ModuleNavigationItem } from "@/lib/baseModule/components/layout/types";
import { useTranslation } from "@/lib/i18n/client";

import { CitizenRoutes, useCitizenRoutes } from "./routes";

export function useCitizenNavigationItem(): ModuleNavigationItem {
  const citizenRoutes: CitizenRoutes = useCitizenRoutes();
  const { t } = useTranslation("medicalRegistry/nav");

  return {
    navigationItem: {
      name: t("title"),
      href: citizenRoutes.home,
    },
  };
}
