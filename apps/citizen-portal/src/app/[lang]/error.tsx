/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { NextErrorBoundary, NextErrorBoundaryProps } from "@eshg/lib-portal";

import { MainContentLayout } from "@/lib/baseModule/components/layout/MainContentLayout";

export default function RootError(props: NextErrorBoundaryProps) {
  return (
    <MainContentLayout>
      <NextErrorBoundary {...props} />
    </MainContentLayout>
  );
}
