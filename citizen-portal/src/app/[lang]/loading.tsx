/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { LoadingIndicator } from "@eshg/lib-portal/components/LoadingIndicator";

import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function Loading() {
  return (
    <PageLayout>
      <PageContent fullHeight>
        <LoadingIndicator text="Seite wird geladen…" fullHeight flexGrow={1} />
      </PageContent>
    </PageLayout>
  );
}
