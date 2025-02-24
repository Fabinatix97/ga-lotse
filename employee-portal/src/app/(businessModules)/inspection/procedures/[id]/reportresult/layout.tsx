/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

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
