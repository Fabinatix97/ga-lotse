/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { CallOutlined, MailOutlineOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useSchoolEntryPublicCitizenApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { getOpeningHoursQuery } from "@/lib/businessModules/schoolEntry/api/queries/publicCitizenApi";
import { useTranslation } from "@/lib/i18n/client";
import { DepartmentInfo } from "@/lib/shared/api/models/DepartmentInfo";
import { AddressSection } from "@/lib/shared/components/AddressSection";
import { OpeningHoursSection } from "@/lib/shared/components/OpeningHoursSection";
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
import { formatStreetAndHouseNumber } from "@/lib/shared/formatters/address";
import { DepartmentInfoProps } from "@/lib/shared/types";

interface LandingpageContentProps {
  departmentInfo: DepartmentInfo;
}

export function LandingpageContent(props: LandingpageContentProps) {
  const { t } = useTranslation(["schoolEntry/overview"]);
  const publicCitizenApi = useSchoolEntryPublicCitizenApi();
  const { data: openingHours } = useSuspenseQuery(
    getOpeningHoursQuery(publicCitizenApi),
  );

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
          <AddressSection
            department={props.departmentInfo}
            localePath="schoolEntry/overview"
          />
          <OpeningHoursSection
            openingHours={openingHours}
            localePath="schoolEntry/overview"
          />
          <PhoneNumbersSection department={props.departmentInfo} />
          <EmailSection department={props.departmentInfo} />
        </InfoSectionGrid>
      </ContentSheet>
    </GridColumnStack>
  );
}

function PhoneNumbersSection(props: DepartmentInfoProps) {
  const { t } = useTranslation(["schoolEntry/overview"]);
  return (
    <InfoSection icon={<CallOutlined />}>
      <InfoSectionTitle>{t("contact.telefonSection.title")}</InfoSectionTitle>
      <Typography>
        {t("contact.telefonSection.number", {
          phoneNumber: props.department.phoneNumber,
        })}
      </Typography>
    </InfoSection>
  );
}

function EmailSection(props: DepartmentInfoProps) {
  const { t } = useTranslation(["schoolEntry/overview"]);
  const email = props.department.email;
  return (
    <InfoSection icon={<MailOutlineOutlined />}>
      <InfoSectionTitle>{t("contact.emailSection.title")}</InfoSectionTitle>
      <ExternalLink href={`mailto:${email}`}>{email}</ExternalLink>
    </InfoSection>
  );
}
