/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetReportDetails } from "@/lib/businessModules/statistics/api/queries/useGetReportDetails";
import { ReportDetails } from "@/lib/businessModules/statistics/components/reports/ReportDetails";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function ReportDetailsPage(
  props: Readonly<{ params: { id: string } }>,
) {
  const reportDetails = useGetReportDetails(props.params.id);

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar title={reportDetails.title} backHref={routes.reports.index} />
      }
    >
      <MainContentLayout>
        <ReportDetails {...reportDetails} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
