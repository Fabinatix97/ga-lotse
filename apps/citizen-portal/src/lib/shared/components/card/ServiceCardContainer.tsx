/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import TravelMedicineIcon from "@mui/icons-material/Vaccines";
import SchoolEntryIcon from "@mui/icons-material/Wc";
import { List, ListItem, Stack, Typography } from "@mui/joy";
import { useId } from "react";
import { isEmpty } from "remeda";

import { ApiBusinessModule } from "@eshg/base-api";
import { StethoscopeIcon } from "@eshg/lib-portal";

import {
  NavigationCardItem,
  NavigationCards,
} from "@/lib/baseModule/components/layout/types";
import { useCitizenRoutes as useOfficialMedicalServiceRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useCitizenRoutes as useSchoolEntryCitizenRoutes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { useCitizenRoutes as useTravelMedicineRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { ServiceCard } from "@/lib/shared/components/card/ServiceCard";
import { useHasBusinessModule } from "@/lib/shared/hooks/useHasBusinessModule";

export function useMostSearchedCitizenServices(): NavigationCards {
  const hasBusinessModule = useHasBusinessModule();
  const schoolEntryCitizenRoutes = useSchoolEntryCitizenRoutes();
  const travelMedicineRoutes = useTravelMedicineRoutes();
  const officialMedicalServiceRoutes = useOfficialMedicalServiceRoutes();
  const { t } = useTranslation();

  const subItems: NavigationCardItem[] = [];
  if (hasBusinessModule(ApiBusinessModule.SchoolEntry)) {
    subItems.push({
      name: t("schoolEntry/nav:title"),
      href: schoolEntryCitizenRoutes.overview,
      icon: SchoolEntryIcon,
    });
  }
  if (hasBusinessModule(ApiBusinessModule.TravelMedicine)) {
    subItems.push({
      name: t("travelMedicine/nav:title"),
      href: travelMedicineRoutes.overview,
      icon: TravelMedicineIcon,
    });
  }
  if (hasBusinessModule(ApiBusinessModule.OfficialMedicalService)) {
    subItems.push({
      name: t("officialMedicalService/nav:title"),
      href: officialMedicalServiceRoutes.overview,
      icon: StethoscopeIcon,
    });
  }

  return {
    name: t("most_searched_services_title"),
    items: subItems,
  };
}

export function ServiceCardContainer({
  navigationItem,
}: {
  navigationItem: NavigationCards;
}) {
  const titleId = useId();

  if (isEmpty(navigationItem.items)) {
    return false;
  }

  return (
    <Stack
      component="section"
      aria-labelledby={titleId}
      sx={{ width: "100%", gap: 4 }}
    >
      <Typography id={titleId} level="h2">
        {navigationItem.name}
      </Typography>
      <List
        sx={{
          flexDirection: byBreakpoint({ mobile: "column", desktop: "row" }),
          gap: byBreakpoint({ mobile: 2, desktop: 5 }),
          padding: 0,
        }}
      >
        {navigationItem.items.map((subItem) => (
          <ListItem
            key={subItem.name}
            sx={{
              flex: "1",
              padding: 0,
            }}
          >
            <ServiceCard
              key={subItem.name}
              name={subItem.name}
              href={subItem.href}
              icon={subItem.icon}
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
