/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  NextErrorBoundary,
  NextErrorBoundaryProps,
} from "@eshg/lib-portal/components/boundaries/NextErrorBoundary";

import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

export default function ProphylaxisSessionError(props: NextErrorBoundaryProps) {
  return (
    <MainContentLayout fullViewportHeight>
      <NextErrorBoundary {...props} />
    </MainContentLayout>
  );
}
