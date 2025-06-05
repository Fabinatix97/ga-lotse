/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MedicalServicesOutlined } from "@mui/icons-material";

import { NavigationItem } from "@/lib/baseModule/components/layout/types";
import { useTranslation } from "@/lib/i18n/client";

import { useCitizenRoutes } from "./routes";

export function useCitizenNavigationItems(): NavigationItem[] {
  const citizenRoutes = useCitizenRoutes();
  const { t } = useTranslation("stiProtection/nav");
  return [
    {
      name: t("sti_protection_title"),
      subItems: [
        {
          name: t("landing.sti_consultation_title"),
          href: citizenRoutes.stiConsultation.index,
          icon: MedicalServicesOutlined,
        },
        {
          name: t("landing.sex_work_title"),
          href: citizenRoutes.sexWork.index,
          icon: MedicalServicesOutlined,
        },
        {
          name: t("landing.results_status_title"),
          href: citizenRoutes.resultsStatus,
          icon: MedicalServicesOutlined,
        },
      ],
    },
  ];
}
