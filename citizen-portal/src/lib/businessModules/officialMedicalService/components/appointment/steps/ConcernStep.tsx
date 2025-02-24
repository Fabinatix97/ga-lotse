/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

export function ConcernStep() {
  const { t } = useTranslation(["officialMedicalService/appointment"]);

  return (
    <ContentSheet>
      <Typography level="h2">{t("concern.title")}</Typography>
      <Alert
        title={t("concern.infoText.title")}
        color={"primary"}
        message={t("concern.infoText.description")}
      />
      <Typography level="body-md">{t("concern.description")}</Typography>
      <Typography level="body-md">...to be done</Typography>
    </ContentSheet>
  );
}
