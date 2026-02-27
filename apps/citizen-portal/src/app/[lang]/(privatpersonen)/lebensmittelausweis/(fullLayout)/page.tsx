/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";

import { useIsMobile } from "@eshg/lib-portal";

import { useInfectionBriefingCitizenPublicApi } from "@/lib/businessModules/infectionBriefing/api/clients";
import {
  getDepartmentInfoQuery,
  getOpeningHoursQuery,
  useGetLandingPageContentQuery,
} from "@/lib/businessModules/infectionBriefing/api/queries/publicCitizenApi";
import {
  AppointmentSection,
  LandingPageContent,
} from "@/lib/businessModules/infectionBriefing/components/landing/LandingPageContent";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import {
  GridColumnStack,
  OneColumnGrid,
  TwoColumnGrid,
} from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function CitizenInfectionBriefingPage() {
  const { t } = useTranslation(["infectionBriefing/overview"]);

  const isMobile = useIsMobile();
  const publicCitizenApi = useInfectionBriefingCitizenPublicApi();
  const [
    { data: landingContent },
    { data: departmentInfo },
    { data: openingHours },
  ] = useSuspenseQueries({
    queries: [
      useGetLandingPageContentQuery(publicCitizenApi),
      getDepartmentInfoQuery(publicCitizenApi),
      getOpeningHoursQuery(publicCitizenApi),
    ],
  });

  return (
    <PageLayout banner="private">
      <PageContent>
        <PageTitle>{t("pageTitle")}</PageTitle>
        {isMobile ? (
          <OneColumnGrid
            contentTop={<AppointmentSection enabled={Boolean(true)} />}
            contentCenter={
              <LandingPageContent
                landingContent={landingContent}
                departmentInfo={departmentInfo}
                openingHours={openingHours}
              />
            }
          />
        ) : (
          <TwoColumnGrid
            content={
              <LandingPageContent
                landingContent={landingContent}
                departmentInfo={departmentInfo}
                openingHours={openingHours}
              />
            }
            sidePanel={
              <GridColumnStack>
                <AppointmentSection enabled={Boolean(true)} />
              </GridColumnStack>
            }
          />
        )}
      </PageContent>
    </PageLayout>
  );
}
