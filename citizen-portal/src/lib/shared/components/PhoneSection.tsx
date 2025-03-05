/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetDepartmentInfoResponse } from "@eshg/base-api";
import { CallOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";

interface PhoneSectionProps {
  department: ApiGetDepartmentInfoResponse;
  localePath: string;
}

export function PhoneSection({
  department,
  localePath,
}: Readonly<PhoneSectionProps>) {
  const { t } = useTranslation([`${localePath}`]);
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
