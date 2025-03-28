/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { ApiConcern } from "@eshg/sti-protection-api";
import { CallOutlined, MailOutlineOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";

import {
  useDepartmentInfo,
  useOpeningHours,
} from "@/lib/businessModules/stiProtection/api/queries/publicCitizenApi";
import { TranslatedList } from "@/lib/businessModules/stiProtection/components/shared/TranslatedList";
import { useTranslation } from "@/lib/i18n/client";
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
import { DepartmentInfoProps } from "@/lib/shared/types";

interface LandingpageContentProps {
  concern: ApiConcern;
}

export function LandingpageContent({ concern }: LandingpageContentProps) {
  const { t } = useTranslation("stiProtection/overview");
  const { data: departmentInfo } = useDepartmentInfo(concern);
  const { data: openingHours } = useOpeningHours(concern);

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("information.title")}</ContentSheetTitle>
        <Typography>{t("information.invitation")}</Typography>
        <Typography>{t("information.cancellation")}</Typography>

        <TranslatedList
          baseKey="information"
          headingKey="applies_to_heading"
          listKey="applies_to_list"
          localePath="stiProtection/overview"
          length={3}
        />

        <TranslatedList
          baseKey="information"
          headingKey="tests_available_heading"
          listKey="tests_available_list"
          localePath="stiProtection/overview"
          length={3}
        />

        <TranslatedList
          baseKey="information"
          headingKey="exceptions_heading"
          listKey="exceptions_list"
          localePath="stiProtection/overview"
          length={2}
        />
      </ContentSheet>
      <ContentSheet>
        <ContentSheetTitle>{t("contact.title")}</ContentSheetTitle>
        <InfoSectionGrid>
          <AddressSection
            department={departmentInfo}
            localePath="stiProtection/overview"
          />
          <OpeningHoursSection
            openingHours={openingHours}
            localePath="stiProtection/overview"
          />
          <PhoneNumbersSection department={departmentInfo} />
          <EmailSection department={departmentInfo} />
        </InfoSectionGrid>
      </ContentSheet>
    </GridColumnStack>
  );
}

function PhoneNumbersSection({ department }: DepartmentInfoProps) {
  const { t } = useTranslation("stiProtection/overview");
  return (
    <InfoSection icon={<CallOutlined />}>
      <InfoSectionTitle>{t("contact.phone_section.title")}</InfoSectionTitle>
      <Typography>
        {t("contact.phone_section.number", {
          phoneNumber: department.phoneNumber,
        })}
      </Typography>
    </InfoSection>
  );
}

function EmailSection({ department }: DepartmentInfoProps) {
  const { t } = useTranslation("stiProtection/overview");
  const email = department.email;
  return (
    <InfoSection icon={<MailOutlineOutlined />}>
      <InfoSectionTitle>{t("contact.email_section.title")}</InfoSectionTitle>
      <ExternalLink href={`mailto:${email}`}>{email}</ExternalLink>
    </InfoSection>
  );
}
