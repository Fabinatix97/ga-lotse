/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";

import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { PAGE_ALERT_STYLE } from "@/lib/shared/styles";

export default function NotFound() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="404: Nicht gefunden" />}>
      <MainContentLayout>
        <Alert
          title="Seite nicht gefunden"
          message="Die aufgerufene Seite konnte leider nicht gefunden werden."
          color="danger"
          sx={PAGE_ALERT_STYLE}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
