/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { AnamnesisStepper } from "@/lib/businessModules/stiProtection/components/anamnesis/AnamnesisStepper";
import { PageContent } from "@/lib/shared/components/layout/PageContent";

export default function CitizenSexualHealthAnamnesisPage() {
  return (
    <PageContent>
      <AnamnesisStepper />
    </PageContent>
  );
}
