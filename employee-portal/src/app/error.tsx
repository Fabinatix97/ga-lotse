/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  NextErrorBoundary,
  NextErrorBoundaryProps,
} from "@eshg/lib-portal/components/boundaries/NextErrorBoundary";

import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

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
