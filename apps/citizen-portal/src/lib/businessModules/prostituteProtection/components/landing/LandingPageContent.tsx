/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useProstituteProtectionCitizenPublicApi } from "@/lib/businessModules/prostituteProtection/api/clients";
import {
  getDepartmentInfoQuery,
  getOpeningHoursQuery,
} from "@/lib/businessModules/prostituteProtection/api/queries/publicCitizenApi";
import { useTranslation } from "@/lib/i18n/client";
import { ContactAndAvailabilitySheet } from "@/lib/shared/components/ContactAndAvailabilitySheet";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

export function LandingPageContent() {
  const { t } = useTranslation(["prostituteProtection/overview"]);

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("generalInformation.title")}</ContentSheetTitle>
      </ContentSheet>
      <ContactSection />
    </GridColumnStack>
  );
}

export function AppointmentSection() {
  const { t } = useTranslation(["prostituteProtection/overview"]);

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("appointmentsSection.title")}</ContentSheetTitle>
      <Typography>{t("appointmentsSection.description")}</Typography>
    </ContentSheet>
  );
}

function ContactSection() {
  const publicCitizenApi = useProstituteProtectionCitizenPublicApi();
  const [{ data: departmentInfo }, { data: openingHours }] = useSuspenseQueries(
    {
      queries: [
        getDepartmentInfoQuery(publicCitizenApi),
        getOpeningHoursQuery(publicCitizenApi),
      ],
    },
  );
  return (
    <ContentSheet>
      <ContactAndAvailabilitySheet
        openingHoursSectionProps={{
          openingHourTranslations: openingHours,
        }}
        departmentInfo={departmentInfo}
      />
    </ContentSheet>
  );
}

export function LandingPageSidePanel() {
  return (
    <GridColumnStack>
      <AppointmentSection />
    </GridColumnStack>
  );
}
