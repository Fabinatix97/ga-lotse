/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import {
  NextErrorBoundary,
  NextErrorBoundaryProps,
} from "@eshg/lib-portal/components/boundaries/NextErrorBoundary";

export default function ProphylaxisSessionError(props: NextErrorBoundaryProps) {
  return (
    <MainContentLayout fullViewportHeight>
      <NextErrorBoundary {...props} />
    </MainContentLayout>
  );
}
