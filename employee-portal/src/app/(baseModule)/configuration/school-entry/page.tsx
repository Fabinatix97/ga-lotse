/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";

import { ConfigurationTabItem } from "@/lib/configuration/api/models/configurationTabItem";
import { ConfigurationLayout } from "@/lib/configuration/components/shared/ConfigurationLayout";
import { routes } from "@/lib/configuration/shared/routes";

export default function SchoolEntryConfigurationPage() {
  const status = "complete";
  const _tabItems: ConfigurationTabItem[] = [
    {
      tabButtonName: "Angaben zum GA",
      href: routes.schoolEntry.index,
      status,
    },
  ];

  return (
    <ConfigurationLayout status={status} module={"schoolEntry"}>
      <Typography level="h1">Configuration school-entry</Typography>
    </ConfigurationLayout>
  );
}
