/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Imprint } from "@/lib/baseModule/components/imprint/Imprint";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function ImprintPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={"Impressum"} />}>
      <MainContentLayout>
        <Imprint />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
