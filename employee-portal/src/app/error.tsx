/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";
import {
  NextErrorBoundary,
  NextErrorBoundaryProps,
} from "@eshg/lib-portal/components/boundaries/NextErrorBoundary";

export default function RootError(props: NextErrorBoundaryProps) {
  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="Hoppla, etwas ist schief gelaufen" />}
    >
      <MainContentLayout>
        <NextErrorBoundary {...props} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
