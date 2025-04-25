/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";

import { Alert } from "@eshg/lib-portal/components/Alert";

import { GoToResultsStatusCard } from "@/lib/businessModules/stiProtection/components/details/GoToResultsStatusCard";
import { TranslatedList } from "@/lib/businessModules/stiProtection/components/shared/TranslatedList";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { ColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export function ResultsStatusLandingPage() {
  const { t } = useTranslation(["stiProtection/resultsStatus"]);
  return (
    <PageLayout banner="private">
      <PageContent>
        <PageTitle>{t("title")}</PageTitle>
        <ColumnGrid>
          <InformationCard />
          <GoToResultsStatusCard variant="landing" />
        </ColumnGrid>
      </PageContent>
    </PageLayout>
  );
}

function InformationCard() {
  const { t } = useTranslation("stiProtection/resultsStatus");
  return (
    <ContentSheet>
      <ContentSheetTitle>{t("landing.info.title")}</ContentSheetTitle>
      <Alert color="primary" message={t("landing.info.warning")} />

      <Typography>{t("landing.info.welcome")}</Typography>
      <Typography fontWeight="bold">
        {t("landing.info.more_tests_subtitle")}
      </Typography>
      <Typography>{t("landing.info.more_tests_body")}</Typography>
      <Typography fontWeight="bold">
        {t("landing.info.call_for_results_subtitle")}
      </Typography>
      <Typography>{t("landing.info.call_for_results_body")}</Typography>

      <TranslatedList
        localePath="stiProtection/resultsStatus"
        baseKey="landing.info"
        headingKey="important_background_subtitle"
        listKey="important_background_points"
      />

      <Typography>{t("landing.info.available_for_questions")}</Typography>
    </ContentSheet>
  );
}
