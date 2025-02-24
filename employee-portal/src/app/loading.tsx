/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { LoadingIndicator } from "@eshg/lib-portal/components/LoadingIndicator";

export default function Loading() {
  return (
    <MainContentLayout fullViewportHeight>
      <LoadingIndicator text="Seite wird geladen…" fullHeight />
    </MainContentLayout>
  );
}
