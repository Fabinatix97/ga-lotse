/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";

import { MarkdownSheet } from "@/lib/baseModule/components/MarkdownSheet";
import {
  useGetDepartmentInfoQuery,
  useGetLandingContent,
  useGetOpeningHoursQuery,
} from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { useTranslation } from "@/lib/i18n/client";
import { ContactAndAvailabilitySheet } from "@/lib/shared/components/ContactAndAvailabilitySheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

export function LandingpageContent() {
  const { t } = useTranslation(["officialMedicalService/landing"]);

  const [
    { data: departmentInfo },
    { data: openingHours },
    { data: landingContent },
  ] = useSuspenseQueries({
    queries: [
      useGetDepartmentInfoQuery(),
      useGetOpeningHoursQuery(),
      useGetLandingContent(),
    ],
  });

  return (
    <GridColumnStack>
      <MarkdownSheet title={t("information.title")} source={landingContent} />
      <ContactAndAvailabilitySheet
        openingHoursSectionProps={{
          openingHourTranslations: openingHours,
        }}
        departmentInfo={departmentInfo}
      />
    </GridColumnStack>
  );
}
