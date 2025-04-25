/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { MailOutlineOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";

import { ApiGetDepartmentInfoResponse } from "@eshg/base-api";
import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";

import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";

interface EmailSectionProps {
  department: ApiGetDepartmentInfoResponse;
  localePath: string;
}

export function EmailSection({
  department,
  localePath,
}: Readonly<EmailSectionProps>) {
  const { t } = useTranslation([`${localePath}`]);
  const email = department.email;
  return (
    <InfoSection icon={<MailOutlineOutlined />}>
      <InfoSectionTitle>{t("contact.email_section.title")}</InfoSectionTitle>
      <Typography>
        <ExternalLink
          href={`mailto:${email}`}
          sx={{ textDecoration: "underline" }}
        >
          {email}
        </ExternalLink>
      </Typography>
    </InfoSection>
  );
}
