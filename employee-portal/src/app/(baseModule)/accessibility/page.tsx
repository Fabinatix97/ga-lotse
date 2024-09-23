/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Accessibility } from "@/lib/baseModule/components/accessibility/Accessibility";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function AccessibilityPage() {
  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title={"Erklärung zur Barrierefreiheit"} />}
    >
      <MainContentLayout>
        <Accessibility />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
