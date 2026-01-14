/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BookOutlined,
  DiamondOutlined,
  PieChartOutlined,
  TableChartOutlined,
} from "@mui/icons-material";
import { PropsWithChildren } from "react";

import {
  StickyToolbarLayout,
  TabNavigationItem,
  TabNavigationToolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";

import {
  EvaluationDetailsTabHeader,
  EvaluationDetailsTabHeaderProps,
} from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationDetailsTabHeader";
import { routes } from "@/lib/businessModules/statistics/shared/routes";

export function EvaluationDetailsLayout({
  evaluationId: evaluationId,
  evaluationDetailsTabHeaderProps: evaluationDetailsTabHeaderProps,
  children,
}: PropsWithChildren<{
  evaluationId: string;
  evaluationDetailsTabHeaderProps: EvaluationDetailsTabHeaderProps;
}>) {
  const tabNavigationItems: TabNavigationItem[] = [
    {
      href: routes.evaluations.details(evaluationId).index,
      tabButtonName: "Analysen",
      decorator: <PieChartOutlined />,
      exactMatch: true,
    },

    {
      href: routes.evaluations.details(evaluationId).reports,
      tabButtonName: "Reports",
      decorator: <BookOutlined />,
    },

    {
      href: routes.evaluations.details(evaluationId).table,
      tabButtonName: "Tabelle",
      decorator: <TableChartOutlined />,
    },
    {
      href: routes.evaluations.details(evaluationId).dataQuality,
      tabButtonName: "Datenqualität",
      decorator: <DiamondOutlined />,
      exactMatch: true,
    },
  ];

  return (
    <StickyToolbarLayout
      toolbar={
        <TabNavigationToolbar
          header={
            <EvaluationDetailsTabHeader {...evaluationDetailsTabHeaderProps} />
          }
          items={tabNavigationItems}
          backButton={<ToolbarBackButton href={routes.evaluations.index} />}
        />
      }
    >
      {children}
    </StickyToolbarLayout>
  );
}
