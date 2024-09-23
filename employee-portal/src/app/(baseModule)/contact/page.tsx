/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Contact } from "@/lib/baseModule/components/contact/Contact";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function ContactPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={"Kontakt"} />}>
      <MainContentLayout>
        <Contact />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
