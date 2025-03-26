/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";

import { ConfigurationTabItem } from "@/lib/configuration/api/models/configurationTabItem";
import { ConfigurationLayout } from "@/lib/configuration/components/shared/ConfigurationLayout";
import { routes } from "@/lib/configuration/shared/routes";

export default function MeaslesProtectionConfigurationPage() {
  const status = "warning";
  const _tabItems: ConfigurationTabItem[] = [
    {
      tabButtonName: "Angaben zum GA",
      href: routes.measlesProtection.index,
      status,
    },
  ];

  return (
    <ConfigurationLayout status={status} module={"measlesProtection"}>
      <Typography level="h1">Configuration measles-protection</Typography>
    </ConfigurationLayout>
  );
}
