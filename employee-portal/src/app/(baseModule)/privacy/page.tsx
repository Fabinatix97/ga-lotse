/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Privacy } from "@/lib/baseModule/components/privacy/Privacy";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function PrivacyPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={"Datenschutzerklärung"} />}>
      <MainContentLayout>
        <Privacy />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
