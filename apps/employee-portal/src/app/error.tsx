/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { NextErrorBoundary, NextErrorBoundaryProps } from "@eshg/lib-portal";

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
