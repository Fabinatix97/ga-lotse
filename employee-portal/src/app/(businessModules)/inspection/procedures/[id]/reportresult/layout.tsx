/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

export default function InspectionReportResultLayout({
  children,
}: Readonly<RequiresChildren>) {
  // the MainContentLayout needs zero padding/margin because of the bottom
  // toolbar that's contained therein. The padding/margin is added to some
  // of the children (see InspectionTabReportResult)
  return (
    <MainContentLayout sx={{ margin: 0, padding: 0 }} fullViewportHeight>
      {children}
    </MainContentLayout>
  );
}
