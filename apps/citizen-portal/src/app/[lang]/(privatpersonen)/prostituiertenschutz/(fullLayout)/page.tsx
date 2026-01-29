/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";

import { useIsMobile } from "@eshg/lib-portal";

import { useProstituteProtectionCitizenPublicApi } from "@/lib/businessModules/prostituteProtection/api/clients";
import {
  getDepartmentInfoQuery,
  getOpeningHoursQuery,
  useGetLandingPageContentQuery,
  useGetPublicConfigurationQuery,
} from "@/lib/businessModules/prostituteProtection/api/queries/publicCitizenApi";
import {
  AppointmentSection,
  LandingPageContent,
} from "@/lib/businessModules/prostituteProtection/components/landing/LandingPageContent";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import {
  GridColumnStack,
  OneColumnGrid,
  TwoColumnGrid,
} from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function CitizenProstitutionProtectionPage() {
  const { t } = useTranslation(["prostituteProtection/overview"]);

  const isMobile = useIsMobile();
  const publicCitizenApi = useProstituteProtectionCitizenPublicApi();
  const [
    { data: landingContent },
    { data: configuration },
    { data: departmentInfo },
    { data: openingHours },
  ] = useSuspenseQueries({
    queries: [
      useGetLandingPageContentQuery(publicCitizenApi),
      useGetPublicConfigurationQuery(publicCitizenApi),
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
            contentTop={
              <AppointmentSection
                enabled={configuration.onlinePortalBookingEnabled}
              />
            }
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
                <AppointmentSection
                  enabled={configuration.onlinePortalBookingEnabled}
                />
              </GridColumnStack>
            }
          />
        )}
      </PageContent>
    </PageLayout>
  );
}
