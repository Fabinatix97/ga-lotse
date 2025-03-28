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

export default function SchoolEntryConfiguratorPage() {
  const status = "complete";
  const _tabItems: configuratorTabItem[] = [
    {
      tabButtonName: "Angaben zum GA",
      href: routes.schoolEntry.index,
      status,
    },
  ];
  const { data } = useGetDepartmentInfo("schoolEntry");

  return (
    <ConfiguratorLayout status={status} module={"schoolEntry"}>
      <Typography level="h1">Configuration school-entry</Typography>
      {data.departmentInfo?.name}
    </ConfiguratorLayout>
  );
}
