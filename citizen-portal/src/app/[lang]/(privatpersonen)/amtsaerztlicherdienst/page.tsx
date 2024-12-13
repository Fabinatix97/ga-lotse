/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";

import { useGetDepartmentInfoQuery } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { LandingpageContent } from "@/lib/businessModules/officialMedicalService/components/landing/LandingpageContent";
import { LandingpageSidePanel } from "@/lib/businessModules/officialMedicalService/components/landing/LandingpageSidePanel";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function CitizenOmsEntryPage() {
  const { t } = useTranslation(["officialMedicalService/landing"]);
  const [{ data: departmentInfo }] = useSuspenseQueries({
    queries: [useGetDepartmentInfoQuery()],
  });

  return (
    <PageLayout banner="private">
      <PageContent>
        <PageTitle>{t("pageTitle")}</PageTitle>
        <TwoColumnGrid
          content={<LandingpageContent departmentInfo={departmentInfo} />}
          sidePanel={<LandingpageSidePanel />}
        />
      </PageContent>
    </PageLayout>
  );
}
