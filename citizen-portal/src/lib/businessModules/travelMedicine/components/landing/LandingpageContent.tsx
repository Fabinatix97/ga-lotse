/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import {
  AccessTimeOutlined,
  ChatBubbleOutlineOutlined,
  FmdGoodOutlined,
} from "@mui/icons-material";
import { Typography } from "@mui/joy";

import {
  useGetDepartmentInfo,
  useGetOpeningHours,
} from "@/lib/businessModules/travelMedicine/api/queries/citizenPublicApi";
import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionGrid,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";
import {
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
} from "@/lib/shared/formatters/address";
import { DepartmentInfoProps } from "@/lib/shared/types";

export function LandingpageContent() {
  const { t } = useTranslation(["travelMedicine/landing"]);
  const { data: department } = useGetDepartmentInfo();

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("contact.title")}</ContentSheetTitle>
        <InfoSectionGrid>
          <AddressSection department={department} />
          <ContactDataSection department={department} />
        </InfoSectionGrid>
        <OpeningHoursSection />
      </ContentSheet>
    </GridColumnStack>
  );
}

function AddressSection(props: Readonly<DepartmentInfoProps>) {
  const { t } = useTranslation(["travelMedicine/landing"]);

  return (
    <InfoSection icon={<FmdGoodOutlined />}>
      <InfoSectionTitle>{t("contact.address")}</InfoSectionTitle>
      <Typography>
        {props.department.name}
        <br />
        {formatStreetAndHouseNumber(props.department)}
        <br />
        {formatPostalCodeAndCity(props.department)}
      </Typography>
    </InfoSection>
  );
}

function OpeningHoursSection() {
  const { t, i18n } = useTranslation(["travelMedicine/landing"]);
  const { data: openingHours } = useGetOpeningHours();
  let openingHoursInSelectedLanguage;
  if (i18n.language === "de") {
    openingHoursInSelectedLanguage = openingHours.de;
  } else {
    openingHoursInSelectedLanguage = openingHours.en;
  }

  return (
    <InfoSection icon={<AccessTimeOutlined />}>
      <InfoSectionTitle>{t("contact.openingHours")}</InfoSectionTitle>
      {openingHoursInSelectedLanguage.map((openingHour) => (
        <p style={{ margin: 0 }} key={openingHour}>
          {openingHour}
        </p>
      ))}
    </InfoSection>
  );
}

function ContactDataSection(props: Readonly<DepartmentInfoProps>) {
  const { t } = useTranslation(["travelMedicine/landing"]);

  return (
    <InfoSection icon={<ChatBubbleOutlineOutlined />}>
      <InfoSectionTitle>{t("contact.contact")}</InfoSectionTitle>
      <Typography>
        {t("contact.phoneNumber", {
          phoneNumber: props.department.phoneNumber,
        })}
      </Typography>
      <Typography display="inline">
        {t("contact.eMail")}
        {`\u00A0`}
        <ExternalLink href={`mailto:${props.department.email}`}>
          {props.department.email}
        </ExternalLink>
      </Typography>
    </InfoSection>
  );
}
