/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EvaluationTemplatesOverview } from "@/lib/businessModules/statistics/components/statistics/evaluationTemplates/EvaluationTemplatesOverview";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function EvaluationTemplatesOverviewPage() {
  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Auswertungsvorlagen"
          backHref={routes.statistics.index}
        />
      }
    >
      <MainContentLayout fullViewportHeight>
        <EvaluationTemplatesOverview />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
