/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { LandingpageContent } from "@/lib/businessModules/schoolEntry/pages/landingpage/LandingpageContent";
import { LandingpageSidePanel } from "@/lib/businessModules/schoolEntry/pages/landingpage/LandingpageSidePanel";
import { useTranslation } from "@/lib/i18n/client";
import { useDepartmentApi } from "@/lib/shared/api/clients";
import { getDepartmentInfoQuery } from "@/lib/shared/api/queries/department";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function CitizenSchoolEntryPage() {
  const { t } = useTranslation(["schoolEntry/overview"]);
  const departmentApi = useDepartmentApi();
  const { data: departmentInfo } = useSuspenseQuery(
    getDepartmentInfoQuery(departmentApi),
  );

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
