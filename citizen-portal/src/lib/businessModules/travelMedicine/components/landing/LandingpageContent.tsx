/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";

import {
  useGetDepartmentInfoQuery,
  useGetOpeningHoursQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/citizenPublicApi";
import { useTranslation } from "@/lib/i18n/client";
import { AddressSection } from "@/lib/shared/components/AddressSection";
import { ContactSection } from "@/lib/shared/components/ContactSection";
import { OpeningHoursSection } from "@/lib/shared/components/OpeningHoursSection";
import { InfoSectionGrid } from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

export function LandingpageContent() {
  const { t } = useTranslation(["travelMedicine/landing"]);
  const [{ data: department }, { data: openingHours }] = useSuspenseQueries({
    queries: [useGetDepartmentInfoQuery(), useGetOpeningHoursQuery()],
  });

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("contact.title")}</ContentSheetTitle>
        <InfoSectionGrid>
          <AddressSection
            department={department}
            localePath="travelMedicine/landing"
          />
          <ContactSection
            department={department}
            localePath="travelMedicine/landing"
          />
        </InfoSectionGrid>
        <OpeningHoursSection
          openingHours={openingHours}
          localePath="travelMedicine/landing"
        />
      </ContentSheet>
    </GridColumnStack>
  );
}
