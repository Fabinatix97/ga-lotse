/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { ArrowRightAltOutlined, LaptopMacOutlined } from "@mui/icons-material";

import { useTranslation } from "@/lib/i18n/client";
import { useGetDepartmentInfo } from "@/lib/shared/api/queries/department";
import { AddressSection } from "@/lib/shared/components/AddressSection";
import { ContactSection } from "@/lib/shared/components/ContactSection";
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

export function ContactInformation() {
  const { t } = useTranslation(["contact"]);
  const { data: department } = useGetDepartmentInfo();

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("contact.title")}</ContentSheetTitle>
      <InfoSectionGrid>
        <AddressSection department={department} localePath="contact" />
        <ContactSection department={department} localePath="contact" />
        <OpeningHoursSection localePath="contact" />
        <InternetSection department={department} />
      </InfoSectionGrid>
    </ContentSheet>
  );
}

function InternetSection(props: DepartmentInfoProps) {
  const { t } = useTranslation(["contact"]);
  const homepage = props.department.homepage;

  return (
    <InfoSection icon={<LaptopMacOutlined />}>
      <InfoSectionTitle>{t("contact.internetSection.title")}</InfoSectionTitle>
      <ExternalLink
        sx={{
          justifyContent: "space-between",
          wordBreak: "break-all",
        }}
        href={`https://${homepage}`}
        endDecorator={<ArrowRightAltOutlined />}
      >
        {t("contact.internetSection.healthDepartment")}
      </ExternalLink>
    </InfoSection>
  );
}
