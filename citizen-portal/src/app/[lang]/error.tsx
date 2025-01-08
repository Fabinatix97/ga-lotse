/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  NextErrorBoundary,
  NextErrorBoundaryProps,
} from "@eshg/lib-portal/components/boundaries/NextErrorBoundary";

import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function RootError(props: NextErrorBoundaryProps) {
  return (
    <PageLayout>
      <PageContent>
        <NextErrorBoundary {...props} />
      </PageContent>
    </PageLayout>
  );
}
