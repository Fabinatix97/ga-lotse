/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InformationStatementStepper } from "@/lib/businessModules/travelMedicine/components/informationStatement/InformationStatementStepper";
import { PageContent } from "@/lib/shared/components/layout/PageContent";

export default function AnswerInformationStatementPage() {
  return (
    <PageContent>
      <InformationStatementStepper />
    </PageContent>
  );
}
