/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiConcern } from "@eshg/sti-protection-api";

import { LandingpageContent } from "@/lib/businessModules/stiProtection/pages/landingpage/LandingpageContent";
import { LandingpageSidePanel } from "@/lib/businessModules/stiProtection/pages/landingpage/LandingpageSidePanel";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export function Landingpage({ concern }: { concern: ApiConcern }) {
  const { t } = useTranslation(["stiProtection/overview"]);
  const isSexWork = concern === ApiConcern.SexWork;
  const i18nPrefix = isSexWork ? "sex_work" : "sti_consultation";
  return (
    <PageLayout banner="private">
      <PageContent>
        <PageTitle>{t(`${i18nPrefix}.page_title`)}</PageTitle>
        <TwoColumnGrid
          content={
            <LandingpageContent
              concern={
                isSexWork ? ApiConcern.SexWork : ApiConcern.HivStiConsultation
              }
            />
          }
          sidePanel={<LandingpageSidePanel concern={concern} />}
        />
      </PageContent>
    </PageLayout>
  );
}
