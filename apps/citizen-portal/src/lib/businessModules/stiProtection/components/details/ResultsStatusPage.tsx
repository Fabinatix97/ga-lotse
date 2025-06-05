/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useTranslation } from "react-i18next";

import { useGetProcedure } from "@/lib/businessModules/stiProtection/api/queries/citizenApi";
import { ContactAndAvailability } from "@/lib/businessModules/stiProtection/components/ContactAndAvailability";
import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { ColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

import { ResultsStatusContent } from "./ResultsStatusContent";
import { ResultsStatusSidePanel } from "./ResultsStatusSidePanel";

export function ResultsStatusPage() {
  const { t } = useTranslation("stiProtection/resultsStatus");
  const { data: procedure } = useGetProcedure();
  const { concern } = procedure;

  return (
    <PageLayout>
      <PageContent>
        <PageTitle
          toolbar={<LogoutButton text={t("translation:common.leave")} />}
        >
          {t("title")}
        </PageTitle>
        <ColumnGrid>
          <ResultsStatusContent />
          <ResultsStatusSidePanel />
          <ContactAndAvailability concern={concern} />
        </ColumnGrid>
      </PageContent>
    </PageLayout>
  );
}
