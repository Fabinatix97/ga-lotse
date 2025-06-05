/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  MedicalServicesOutlined,
  PhoneInTalkOutlined,
} from "@mui/icons-material";
import { Box, List, ListItem, Typography } from "@mui/joy";
import { useId } from "react";
import { isEmpty } from "remeda";

import { ApiBusinessModule } from "@eshg/base-api";

import {
  NavigationItem,
  SubNavigationItem,
} from "@/lib/baseModule/components/layout/types";
import { useCitizenRoutes as useOfficialMedicalServiceRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useCitizenRoutes as useSchoolEntryCitizenRoutes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { useCitizenRoutes as useTravelMedicineRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ServiceCard } from "@/lib/shared/components/card/ServiceCard";
import { useHasBusinessModule } from "@/lib/shared/hooks/useHasBusinessModule";

export function useMostSearchedCitizenServices(): NavigationItem {
  const hasBusinessModule = useHasBusinessModule();
  const schoolEntryCitizenRoutes = useSchoolEntryCitizenRoutes();
  const travelMedicineRoutes = useTravelMedicineRoutes();
  const officialMedicalServiceRoutes = useOfficialMedicalServiceRoutes();
  const { t } = useTranslation();

  const subItems: SubNavigationItem[] = [];
  if (hasBusinessModule(ApiBusinessModule.SchoolEntry)) {
    subItems.push({
      name: t("schoolEntry/nav:school_entry_title"),
      href: schoolEntryCitizenRoutes.overview,
      icon: MedicalServicesOutlined,
    });
  }
  if (hasBusinessModule(ApiBusinessModule.TravelMedicine)) {
    subItems.push({
      name: t("travelMedicine/nav:travel_medicine_title"),
      href: travelMedicineRoutes.overview,
      icon: PhoneInTalkOutlined,
    });
  }
  if (hasBusinessModule(ApiBusinessModule.OfficialMedicalService)) {
    subItems.push({
      name: t("officialMedicalService/nav:oms_title"),
      href: officialMedicalServiceRoutes.overview,
      icon: PhoneInTalkOutlined,
    });
  }

  return {
    name: t("most_searched_services_title"),
    subItems,
  };
}

export function ServiceCardContainer({
  navigationItem,
}: {
  navigationItem: NavigationItem;
}) {
  const titleId = useId();

  if (isEmpty(navigationItem.subItems)) {
    return false;
  }

  return (
    <Box component="section" aria-labelledby={titleId} sx={{ width: "100%" }}>
      <Typography id={titleId} level="h2">
        {navigationItem.name}
      </Typography>
      <List
        sx={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "16px",
          marginTop: "24px",
          padding: 0,
        }}
      >
        {navigationItem.subItems.map((subItem) => (
          <ListItem
            key={subItem.name}
            sx={{
              flex: "1",
              minWidth: "296px",
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
    </Box>
  );
}
