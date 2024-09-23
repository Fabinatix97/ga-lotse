/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  MedicalServicesOutlined,
  PeopleOutlineOutlined,
  PhoneInTalkOutlined,
} from "@mui/icons-material";
import { Typography } from "@mui/joy";

import { NavigationItem } from "@/lib/baseModule/components/layout/types";
import { useRoutes as useBaseRoutes } from "@/lib/baseModule/shared/routes";
import { useCitizenRoutes as useSchoolEntryCitizenRoutes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { useCitizenRoutes as useTravelMedicineRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ServiceCard } from "@/lib/shared/components/card/ServiceCard";

export function useMostSearchedCitizenServices(): NavigationItem {
  const schoolEntryCitizenRoutes = useSchoolEntryCitizenRoutes();
  const travelMedicineRoutes = useTravelMedicineRoutes();
  const baseRoutes = useBaseRoutes();
  const { t } = useTranslation();

  return {
    name: t("most_searched_services_title"),
    subItems: [
      {
        name: t("schoolEntry/nav:school_entry_title"),
        href: schoolEntryCitizenRoutes.overview,
        icon: MedicalServicesOutlined,
      },
      {
        name: t("travelMedicine/nav:travel_medicine_title"),
        href: travelMedicineRoutes.overview,
        icon: PhoneInTalkOutlined,
      },
      {
        name: t("health_officers_link"),
        href: baseRoutes.citizenPath.index,
        icon: PeopleOutlineOutlined,
      },
    ],
  };
}

export function ServiceCardContainer({
  navigationItem,
}: {
  navigationItem: NavigationItem;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", margin: "56px 0px" }}>
      <div style={{ width: "100%" }}>
        <Typography level="h2">{navigationItem.name}</Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          {navigationItem.subItems.map((subItem) => (
            <ServiceCard
              key={subItem.name}
              name={subItem.name}
              href={subItem.href}
              icon={subItem.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
