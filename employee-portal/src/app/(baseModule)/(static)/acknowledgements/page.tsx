/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Acknowledgements } from "@/lib/baseModule/components/acknowledgements/Acknowledgements";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function AcknowledgementsPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={"Danksagung"} />}>
      <MainContentLayout>
        <Acknowledgements />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
