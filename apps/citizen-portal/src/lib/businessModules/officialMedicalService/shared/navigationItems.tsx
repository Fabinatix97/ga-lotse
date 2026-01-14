/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ModuleNavigationItem } from "@/lib/baseModule/components/layout/types";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useTranslation } from "@/lib/i18n/client";

export function useCitizenNavigationItem(): ModuleNavigationItem {
  const citizenRoutes = useCitizenRoutes();
  const { t } = useTranslation("officialMedicalService/nav");
  return {
    navigationItem: {
      name: t("title"),
      href: citizenRoutes.overview,
    },
  };
}
