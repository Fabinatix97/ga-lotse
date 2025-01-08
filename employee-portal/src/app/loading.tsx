/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { LoadingIndicator } from "@eshg/lib-portal/components/LoadingIndicator";

import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

export default function Loading() {
  return (
    <MainContentLayout fullViewportHeight>
      <LoadingIndicator text="Seite wird geladen…" fullHeight />
    </MainContentLayout>
  );
}
