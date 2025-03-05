/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiConcern } from "@eshg/official-medical-service-api";
import { MedicalServicesOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";

import { useManualTranslation } from "@/lib/businessModules/officialMedicalService/shared/useManualTranslation";
import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";

export function ConcernSection({
  concern,
  localePath,
}: Readonly<{
  concern: ApiConcern;
  localePath: string;
}>) {
  const { t } = useTranslation([`${localePath}`]);

  const name = useManualTranslation({
    de: concern.nameDe,
    en: concern.nameEn,
  });

  return (
    <InfoSection icon={<MedicalServicesOutlined />}>
      <InfoSectionTitle>
        {t("information.concern_section.title")}
      </InfoSectionTitle>
      <Typography>{name}</Typography>
    </InfoSection>
  );
}
