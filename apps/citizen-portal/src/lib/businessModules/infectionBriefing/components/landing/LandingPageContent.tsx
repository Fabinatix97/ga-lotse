/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";

import {
  ApiGetDepartmentInfoResponse,
  ApiGetOpeningHoursResponse,
} from "@eshg/infection-briefing-api";

import { MarkdownSheet } from "@/lib/baseModule/components/MarkdownSheet";
import { useCitizenRoutes } from "@/lib/businessModules/infectionBriefing/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ContactAndAvailabilitySheet } from "@/lib/shared/components/ContactAndAvailabilitySheet";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";
import { ScopedInternalLinkButton } from "@/lib/shared/components/scopedLinks";

interface LandingPageContentProps {
  landingContent: string;
  openingHours: ApiGetOpeningHoursResponse;
  departmentInfo: ApiGetDepartmentInfoResponse;
}

export function LandingPageContent({
  landingContent,
  openingHours,
  departmentInfo,
}: LandingPageContentProps) {
  const { t } = useTranslation(["infectionBriefing/overview"]);

  return (
    <GridColumnStack>
      <MarkdownSheet
        title={t("generalInformation.title")}
        source={landingContent}
      />
      <ContentSheet>
        <ContactAndAvailabilitySheet
          openingHoursSectionProps={{
            openingHourTranslations: openingHours,
          }}
          departmentInfo={departmentInfo}
        />
      </ContentSheet>
    </GridColumnStack>
  );
}

interface AppointmentSectionProps {
  enabled: boolean;
}

export function AppointmentSection({ enabled }: AppointmentSectionProps) {
  const { t } = useTranslation(["infectionBriefing/overview"]);
  const InfectionBriefingRoutes = useCitizenRoutes();

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("appointmentsSection.title")}</ContentSheetTitle>
      {enabled ? (
        <>
          <Typography>
            {t("appointmentsSection.description_enabled")}
          </Typography>
          <ScopedInternalLinkButton
            href={InfectionBriefingRoutes.bookAppointment}
          >
            {t("appointmentsSection.create_appointment")}
          </ScopedInternalLinkButton>
        </>
      ) : (
        <Typography>
          {t("appointmentsSection.description_not_enabled")}
        </Typography>
      )}
    </ContentSheet>
  );
}
