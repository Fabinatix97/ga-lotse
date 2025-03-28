/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";

import { useGetDepartmentInfo } from "@/lib/configurator/api/queries/useGetDepartmentInfo";
import { ConfiguratorLayout } from "@/lib/configurator/components/shared/ConfiguratorLayout";
import { routes } from "@/lib/configurator/shared/routes";

export default function MeaslesProtectionConfiguratorPage() {
  const status = "warning";
  const _tabItems = [
    {
      tabButtonName: "Angaben zum GA",
      href: routes.measlesProtection.index,
      status,
    },
  ];
  const { data } = useGetDepartmentInfo("measlesProtection");

  return (
    <ConfiguratorLayout status={status} module={"measlesProtection"}>
      <Typography level="h1">Configuration measles-protection</Typography>
      {data.departmentInfo?.name}
    </ConfiguratorLayout>
  );
}
