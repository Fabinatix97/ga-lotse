/**
 * Copyright 2025 cronn GmbH
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
import { AddressSection } from "@/lib/shared/components/AddressSection";
import { EmailSection } from "@/lib/shared/components/EmailSection";
import { OpeningHoursSection } from "@/lib/shared/components/OpeningHoursSection";
import { PhoneSection } from "@/lib/shared/components/PhoneSection";
import { InfoSectionGrid } from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
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
      <ContentSheet>
        <ContentSheetTitle>{t("contact.title")}</ContentSheetTitle>
        <InfoSectionGrid>
          <AddressSection
            department={departmentInfo}
            localePath="officialMedicalService/landing"
          />
          <PhoneSection
            department={departmentInfo}
            localePath="officialMedicalService/landing"
          />
          <OpeningHoursSection
            openingHours={openingHours}
            localePath="officialMedicalService/landing"
          />
          <EmailSection
            department={departmentInfo}
            localePath="officialMedicalService/landing"
          />
        </InfoSectionGrid>
      </ContentSheet>
    </GridColumnStack>
  );
}
