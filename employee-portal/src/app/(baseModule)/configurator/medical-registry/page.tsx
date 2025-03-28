/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";

import { configuratorTabItem } from "@/lib/configurator/api/models/configuratorTabItem";
import { useGetDepartmentInfo } from "@/lib/configurator/api/queries/useGetDepartmentInfo";
import { ConfiguratorLayout } from "@/lib/configurator/components/shared/ConfiguratorLayout";
import { routes } from "@/lib/configurator/shared/routes";

export default function MedicalRegistryConfiguratorPage() {
  const status = "complete";
  const _tabItems: configuratorTabItem[] = [
    {
      tabButtonName: "Angaben zum GA",
      href: routes.medicalRegistry.index,
      status,
    },
  ];
  const { data } = useGetDepartmentInfo("medicalRegistry");

  return (
    <ConfiguratorLayout status={status} module={"medicalRegistry"}>
      <Typography level="h1">Configuration measles-protection</Typography>
      {data.departmentInfo?.name}
    </ConfiguratorLayout>
  );
}
