/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import {
  AccessTimeOutlined,
  CallOutlined,
  FmdGoodOutlined,
  MailOutlineOutlined,
} from "@mui/icons-material";
import { Typography } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useSchoolEntryCitizenApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { getOpeningHoursQuery } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryCitizenApi";
import { useTranslation } from "@/lib/i18n/client";
import { DepartmentInfo } from "@/lib/shared/api/models/DepartmentInfo";
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

interface LandingpageContentProps {
  departmentInfo: DepartmentInfo;
}

export function LandingpageContent(props: LandingpageContentProps) {
  const { t } = useTranslation(["schoolEntry/overview"]);

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("information.title")}</ContentSheetTitle>
        <Typography>{t("information.invitation")}</Typography>
        <Typography>{t("information.cancellation")}</Typography>
        <Typography>
          {t("information.location", {
            address: formatStreetAndHouseNumber(props.departmentInfo),
          })}
        </Typography>
      </ContentSheet>
      <ContentSheet>
        <ContentSheetTitle>{t("place.title")}</ContentSheetTitle>
        <InfoSectionGrid>
          <AddressSection department={props.departmentInfo} />
          <OpeningHoursSection />
          <PhoneNumbersSection department={props.departmentInfo} />
          <EmailSection department={props.departmentInfo} />
        </InfoSectionGrid>
      </ContentSheet>
    </GridColumnStack>
  );
}

function AddressSection(props: DepartmentInfoProps) {
  const { t } = useTranslation(["schoolEntry/overview"]);
  return (
    <InfoSection icon={<FmdGoodOutlined />}>
      <InfoSectionTitle>{t("address.title")}</InfoSectionTitle>
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
  const { t, i18n } = useTranslation(["schoolEntry/overview"]);
  const schoolEntryCitizenApi = useSchoolEntryCitizenApi();
  const { data: openingHours } = useSuspenseQuery(
    getOpeningHoursQuery(schoolEntryCitizenApi),
  );

  const openingHoursInSelectedLanguage =
    i18n.language === "de" ? openingHours.de : openingHours.en;
  return (
    <InfoSection icon={<AccessTimeOutlined />}>
      <InfoSectionTitle>{t("openingHours.title")}</InfoSectionTitle>
      {openingHoursInSelectedLanguage.map((openingHour) => (
        <p style={{ margin: 0 }} key={openingHour}>
          {openingHour}
        </p>
      ))}
    </InfoSection>
  );
}

function PhoneNumbersSection(props: DepartmentInfoProps) {
  const { t } = useTranslation(["schoolEntry/overview"]);
  return (
    <InfoSection icon={<CallOutlined />}>
      <InfoSectionTitle>{t("telefon.title")}</InfoSectionTitle>
      <Typography>
        {t("telefon.number", { phoneNumber: props.department.phoneNumber })}
      </Typography>
    </InfoSection>
  );
}

function EmailSection(props: DepartmentInfoProps) {
  const { t } = useTranslation(["schoolEntry/overview"]);
  const email = props.department.email;
  return (
    <InfoSection icon={<MailOutlineOutlined />}>
      <InfoSectionTitle>{t("email.title")}</InfoSectionTitle>
      <ExternalLink href={`mailto:${email}`}>{email}</ExternalLink>
    </InfoSection>
  );
}
