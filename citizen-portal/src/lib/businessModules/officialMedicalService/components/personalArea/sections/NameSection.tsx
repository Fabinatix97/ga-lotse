/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { PersonOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";

export function NameSection({
  person,
  localePath,
}: Readonly<{
  person: {
    firstName: string;
    lastName: string;
  };
  localePath: string;
}>) {
  const { t } = useTranslation([`${localePath}`]);

  return (
    <InfoSection icon={<PersonOutlined />}>
      <InfoSectionTitle>{t("information.name_section.title")}</InfoSectionTitle>
      <Typography>{formatPersonName(person)}</Typography>
    </InfoSection>
  );
}
