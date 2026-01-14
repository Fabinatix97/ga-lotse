/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChatBubbleOutlineOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";

import { ApiGetDepartmentInfoResponse } from "@eshg/base-api";
import { ExternalLink } from "@eshg/lib-portal";

import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";

interface ContactSectionProps {
  department: ApiGetDepartmentInfoResponse;
}

export function ContactSection({ department }: Readonly<ContactSectionProps>) {
  const { t } = useTranslation(["shared/contactSection"]);

  return (
    <InfoSection icon={<ChatBubbleOutlineOutlined />}>
      <InfoSectionTitle>{t("title")}</InfoSectionTitle>
      <Typography>
        {t("phoneNumber", {
          phoneNumber: department.phoneNumber,
        })}
      </Typography>
      <Typography>
        {t("eMail")}
        {`\u00A0`}
        <ExternalLink
          sx={{ wordBreak: "break-all" }}
          href={`mailto:${department.email}`}
        >
          {department.email}
        </ExternalLink>
      </Typography>
    </InfoSection>
  );
}
