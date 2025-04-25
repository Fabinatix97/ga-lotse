/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { CheckCircleOutlined, TimelapseOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { TFunction } from "i18next";
import { Trans } from "react-i18next";

import { Row } from "@eshg/lib-portal/components/Row";

import { useGetProcedure } from "@/lib/businessModules/stiProtection/api/queries/citizenApi";
import { ContactAndAvailability } from "@/lib/businessModules/stiProtection/components/ContactAndAvailability";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

export function ResultsStatusContent() {
  const { t } = useTranslation("stiProtection/resultsStatus");
  const { data: procedure } = useGetProcedure();
  const { concern } = procedure;

  return (
    <Stack gap={2}>
      <ContentSheet>
        <ContentSheetTitle>{t("view.findings_title")}</ContentSheetTitle>
        <CurrentStatus />
      </ContentSheet>
      <ContactAndAvailability concern={concern} />
    </Stack>
  );
}

function CurrentStatus() {
  const { t } = useTranslation("stiProtection/resultsStatus");
  const {
    data: { hasResults },
  } = useGetProcedure();
  const currentStatusKey = hasResults ? "available" : "not_yet_available";

  return (
    <>
      <Row sx={{ p: 1 }}>
        {hasResults ? (
          <CheckCircleOutlined color="success" />
        ) : (
          <TimelapseOutlined color="warning" />
        )}
        <Typography level="body-md" fontWeight="bold">
          {t(`view.status.${currentStatusKey}_label`)}
        </Typography>
      </Row>
      <Typography>
        <Trans
          t={t as unknown as TFunction}
          i18nKey={`stiProtection/resultsStatus:view.status.${currentStatusKey}_info`}
        />
      </Typography>
    </>
  );
}
