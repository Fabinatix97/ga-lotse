/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import {
  AccessTimeOutlined,
  ArrowRightAltOutlined,
  ChatBubbleOutlineOutlined,
  FmdGoodOutlined,
  LaptopMacOutlined,
} from "@mui/icons-material";
import { Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";
import { useGetDepartmentInfo } from "@/lib/shared/api/queries/department";
import {
  InfoSection,
  InfoSectionGrid,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import {
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
} from "@/lib/shared/formatters/address";
import { DepartmentInfoProps } from "@/lib/shared/types";

export function ContactInformation() {
  const { t } = useTranslation(["contact"]);
  const { data: department } = useGetDepartmentInfo();

  return (
    <ContentSheet>
      <ContentSheetTitle>
        {t("pageTitle.contact_information")}
      </ContentSheetTitle>
      <InfoSectionGrid>
        <AddressSection department={department} />
        <ContactSection department={department} />
        <OpeningHoursSection />
        <InternetSection department={department} />
      </InfoSectionGrid>
    </ContentSheet>
  );
}

function AddressSection(props: DepartmentInfoProps) {
  const { t } = useTranslation(["contact"]);

  return (
    <InfoSection icon={<FmdGoodOutlined />}>
      <InfoSectionTitle>{t("sectionTitle.address")}</InfoSectionTitle>
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
  const { t } = useTranslation(["contact"]);

  return (
    <InfoSection icon={<AccessTimeOutlined />}>
      <InfoSectionTitle>{t("sectionTitle.opening_hours")}</InfoSectionTitle>
      <Typography>{t("opening_hours_information")}</Typography>
    </InfoSection>
  );
}

function ContactSection(props: DepartmentInfoProps) {
  const { t } = useTranslation(["contact"]);
  const email = props.department.email;

  return (
    <InfoSection icon={<ChatBubbleOutlineOutlined />}>
      <InfoSectionTitle>{t("sectionTitle.contact")}</InfoSectionTitle>
      <Typography>
        {t("phone_number")}: {props.department.phoneNumber}
      </Typography>
      <Typography>
        E-Mail:{" "}
        <ExternalLink sx={{ wordBreak: "break-all" }} href={`mailto:${email}`}>
          {email}
        </ExternalLink>
      </Typography>
    </InfoSection>
  );
}

function InternetSection(props: DepartmentInfoProps) {
  const { t } = useTranslation(["contact"]);
  const homepage = props.department.homepage;

  return (
    <InfoSection icon={<LaptopMacOutlined />}>
      <InfoSectionTitle>{t("sectionTitle.internet")}</InfoSectionTitle>
      <ExternalLink
        sx={{
          justifyContent: "space-between",
          wordBreak: "break-all",
        }}
        href={`https://${homepage}`}
        endDecorator={<ArrowRightAltOutlined />}
      >
        {t("health_department")}
      </ExternalLink>
    </InfoSection>
  );
}
