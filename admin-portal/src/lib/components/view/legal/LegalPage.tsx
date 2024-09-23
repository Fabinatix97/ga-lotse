/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ContentHeader } from "@/lib/components/layout/page/header/ContentHeader";
import { LegalLinkList } from "@/lib/components/view/legal/LegalLinkList";

export function LegalPage() {
  return (
    <>
      <ContentHeader title="navigation.legal" />
      <LegalLinkList />
    </>
  );
}
