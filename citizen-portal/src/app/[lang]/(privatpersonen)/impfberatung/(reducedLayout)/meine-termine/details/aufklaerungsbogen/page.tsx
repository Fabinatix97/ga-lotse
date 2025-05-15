/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InformationStatementStepper } from "@/lib/businessModules/travelMedicine/components/informationStatement/InformationStatementStepper";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function AnswerInformationStatementPage() {
  return (
    <PageLayout>
      <PageContent>
        <InformationStatementStepper />
      </PageContent>
    </PageLayout>
  );
}
