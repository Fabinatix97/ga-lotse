/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ModuleNavigationItem } from "@/lib/baseModule/components/layout/types";
import { useTranslation } from "@/lib/i18n/client";

import { useCitizenRoutes } from "./routes";

export function useCitizenNavigationItem(): ModuleNavigationItem {
  const citizenRoutes = useCitizenRoutes();
  const { t } = useTranslation("stiProtection/nav");
  return {
    navigationItem: {
      name: t("title"),
      items: [
        {
          name: t("landing.sti_consultation_title"),
          href: citizenRoutes.stiConsultation.index,
        },
        {
          name: t("landing.sex_work_title"),
          href: citizenRoutes.sexWork.index,
        },
        {
          name: t("landing.results_status_title"),
          href: citizenRoutes.resultsStatus,
        },
      ],
    },
  };
}
