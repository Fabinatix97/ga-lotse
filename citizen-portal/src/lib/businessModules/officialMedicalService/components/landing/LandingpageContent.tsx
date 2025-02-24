/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { styled } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useGetOpeningHoursQuery } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { useTranslation } from "@/lib/i18n/client";
import { DepartmentInfo } from "@/lib/shared/api/models/DepartmentInfo";
import { AddressSection } from "@/lib/shared/components/AddressSection";
import { ContactSection } from "@/lib/shared/components/ContactSection";
import { OpeningHoursSection } from "@/lib/shared/components/OpeningHoursSection";
import {
  InfoSectionGrid,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

interface LandingpageContentProps {
  departmentInfo: DepartmentInfo;
}

const StyledList = styled("ul")({
  marginTop: "5px",
});

export function LandingpageContent(props: LandingpageContentProps) {
  const { t } = useTranslation(["officialMedicalService/landing"]);
  const [{ data: openingHours }] = useSuspenseQueries({
    queries: [useGetOpeningHoursQuery()],
  });

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("information.title")}</ContentSheetTitle>
        <p>
          <InfoSectionTitle>
            {t("information.pleaseCome")} {props.departmentInfo.name},{" "}
            {props.departmentInfo.street} {props.departmentInfo.houseNumber},{" "}
            {props.departmentInfo.postalCode} {props.departmentInfo.city}
          </InfoSectionTitle>
          <InfoSectionTitle>{t("information.pleaseBring")}</InfoSectionTitle>
          <StyledList>
            <li>{t("information.perso")}</li>
            <li>{t("information.anamnesis")}</li>
            <li>{t("information.orderLetter")}</li>
            <li>{t("information.medicalDocuments")}</li>
            <li>{t("information.meds")}</li>
          </StyledList>
          <InfoSectionTitle>{t("information.forAttests")}</InfoSectionTitle>
          <StyledList>
            <li>{t("information.onlyFrankfurt")}</li>
            <li>{t("information.comeOnDay")}</li>
          </StyledList>
          <InfoSectionTitle>
            {t("information.definitelyBring")}
          </InfoSectionTitle>
          <StyledList>
            <li>{t("information.docsDoctor")}</li>
            <li>{t("information.docsUniversity")}</li>
            <li>{t("information.studentCard")}</li>
            <li>{t("information.fee")}</li>
          </StyledList>
        </p>
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
