/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useGetOpeningHoursQuery } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { useTranslation } from "@/lib/i18n/client";
import { DepartmentInfo } from "@/lib/shared/api/models/DepartmentInfo";
import { AddressSection } from "@/lib/shared/components/AddressSection";
import { ContactSection } from "@/lib/shared/components/ContactSection";
import { OpeningHoursSection } from "@/lib/shared/components/OpeningHoursSection";
import { InfoSectionGrid } from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

interface LandingpageContentProps {
  departmentInfo: DepartmentInfo;
}

export function LandingpageContent(props: LandingpageContentProps) {
  const { t } = useTranslation(["officialMedicalService/landing"]);
  const [{ data: openingHours }] = useSuspenseQueries({
    queries: [useGetOpeningHoursQuery()],
  });

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("information.title")}</ContentSheetTitle>
        <Typography>{t("information.text")}</Typography>
      </ContentSheet>
      <ContentSheet>
        <ContentSheetTitle>{t("contact.title")}</ContentSheetTitle>
        <InfoSectionGrid>
          <AddressSection
            department={props.departmentInfo}
            localePath="officialMedicalService/landing"
          />
          <ContactSection
            department={props.departmentInfo}
            localePath="officialMedicalService/landing"
          />
          <OpeningHoursSection
            openingHours={openingHours}
            localePath="officialMedicalService/landing"
          />
        </InfoSectionGrid>
      </ContentSheet>
    </GridColumnStack>
  );
}
