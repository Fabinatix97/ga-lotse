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

export default function StiProtectionConfiguratorPage() {
  const status = "error";
  const _tabItems: configuratorTabItem[] = [
    {
      tabButtonName: "Angaben zum GA",
      href: routes.stiProtection.index,
      status,
    },
  ];
  const { data } = useGetDepartmentInfo("stiProtection");

  return (
    <ConfiguratorLayout status={status} module={"stiProtection"}>
      <Typography level="h1">Configuration sti-protection</Typography>
      {data.departmentInfo?.name}
    </ConfiguratorLayout>
  );
}
