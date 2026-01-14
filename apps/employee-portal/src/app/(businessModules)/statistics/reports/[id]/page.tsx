/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal";

import { useGetReportDetails } from "@/lib/businessModules/statistics/api/queries/useGetReportDetails";
import { ReportDetails } from "@/lib/businessModules/statistics/components/reports/ReportDetails";
import { routes } from "@/lib/businessModules/statistics/shared/routes";

export default function ReportDetailsPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);
  const reportDetails = useGetReportDetails(id);

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={reportDetails.title}
          backButton={<ToolbarBackButton href={routes.reports.index} />}
        />
      }
    >
      <MainContentLayout>
        <ReportDetails {...reportDetails} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
