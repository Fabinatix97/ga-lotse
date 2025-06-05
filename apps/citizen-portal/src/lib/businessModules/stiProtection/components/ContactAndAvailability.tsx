/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CallOutlined, MailOutlineOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";

import { ExternalLink } from "@eshg/lib-portal";
import { ApiConcern } from "@eshg/sti-protection-api";

import {
  useDepartmentInfo,
  useOpeningHours,
} from "@/lib/businessModules/stiProtection/api/queries/publicCitizenApi";
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
import { DepartmentInfoProps } from "@/lib/shared/types";

interface ContactAndAvailabilityProps {
  concern: ApiConcern;
}

export function ContactAndAvailability({
  concern,
}: ContactAndAvailabilityProps) {
  const { data: departmentInfo } = useDepartmentInfo(concern);
  const { data: openingHours } = useOpeningHours(concern);
  const { t } = useTranslation("stiProtection/overview");

  return (
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
