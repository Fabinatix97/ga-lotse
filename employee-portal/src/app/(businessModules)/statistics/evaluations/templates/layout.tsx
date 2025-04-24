/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import {
  MainContentLayout,
  StickyToolbarLayout,
  TabNavigationHeader,
  TabNavigationHeaderTypography,
  TabNavigationItem,
  TabNavigationToolbar,
  ToolbarBackButton,
  hasAnyUserRoles,
} from "@eshg/lib-employee-portal";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import {
  BackupTableOutlined,
  CloudDownloadOutlined,
} from "@mui/icons-material";

import { routes } from "@/lib/businessModules/statistics/shared/routes";

export default function EvaluationTemplatesLayout({
  children,
}: RequiresChildren) {
  const tabNavigationItems: TabNavigationItem[] = [
    {
      href: routes.evaluations.templates.index,
      tabButtonName: "Interne Vorlagen",
      decorator: <BackupTableOutlined />,
      exactMatch: true,
    },
    {
      href: routes.evaluations.templates.repository,
      tabButtonName: "Geteilte Vorlagen",
      decorator: <CloudDownloadOutlined />,
      exactMatch: true,
      accessCheck: hasAnyUserRoles([
        ApiUserRole.StatisticsStatisticsWrite,
        ApiUserRole.StatisticsStatisticsAdmin,
      ]),
    },
  ];

  return (
    <StickyToolbarLayout
      toolbar={
        <TabNavigationToolbar
          header={
            <TabNavigationHeader titleAsH1>
              <TabNavigationHeaderTypography>
                Auswertungsvorlagen
              </TabNavigationHeaderTypography>
            </TabNavigationHeader>
          }
          items={tabNavigationItems}
          backButton={<ToolbarBackButton href={routes.evaluations.index} />}
        />
      }
    >
      <MainContentLayout fullViewportHeight>{children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
