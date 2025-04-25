/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useTranslation } from "react-i18next";

import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

import { ResultsStatusContent } from "./ResultsStatusContent";
import { ResultsStatusSidePanel } from "./ResultsStatusSidePanel";

export function ResultsStatusPage() {
  const { t } = useTranslation("stiProtection/resultsStatus");

  return (
    <PageLayout>
      <PageContent>
        <PageTitle
          toolbar={<LogoutButton text={t("translation:common.leave")} />}
        >
          {t("title")}
        </PageTitle>
        <TwoColumnGrid
          content={<ResultsStatusContent />}
          sidePanel={<ResultsStatusSidePanel />}
        />
      </PageContent>
    </PageLayout>
  );
}
