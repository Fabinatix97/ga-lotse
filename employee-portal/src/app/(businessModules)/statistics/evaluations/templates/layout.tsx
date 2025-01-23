/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { hasAnyUserRoles } from "@eshg/lib-employee-portal/helpers/accessControl";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import {
  BackupTableOutlined,
  CloudDownloadOutlined,
} from "@mui/icons-material";

import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@/lib/shared/components/tabNavigationToolbar/TabNavigationHeader";
import { TabNavigationToolbar } from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";

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
          routeBack={routes.evaluations.index}
          items={tabNavigationItems}
          header={
            <TabNavigationHeader titleAsH1>
              <TabNavigationHeaderTypography>
                Auswertungsvorlagen
              </TabNavigationHeaderTypography>
            </TabNavigationHeader>
          }
        />
      }
    >
      <MainContentLayout fullViewportHeight>{children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
