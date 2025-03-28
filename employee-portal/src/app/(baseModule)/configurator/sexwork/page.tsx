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

export default function SexWorkConfiguratorPage() {
  const status = "warning";
  const _tabItems: configuratorTabItem[] = [
    {
      tabButtonName: "Angaben zum GA",
      href: routes.sexWork.index,
      status,
    },
  ];
  const { data } = useGetDepartmentInfo("sexWork");

  return (
    <ConfiguratorLayout status={status} module={"sexWork"}>
      <Typography level="h1">Configuration sexwork</Typography>
      {data.departmentInfo?.name}
    </ConfiguratorLayout>
  );
}
