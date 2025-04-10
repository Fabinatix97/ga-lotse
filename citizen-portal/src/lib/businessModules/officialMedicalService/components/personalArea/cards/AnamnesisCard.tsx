/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { UploadOutlined } from "@mui/icons-material";
import { Box, Sheet, Typography } from "@mui/joy";

import { theme } from "@/lib/baseModule/theme/theme";
import {
  HeaderGrid,
  IndicatorIcon,
} from "@/lib/businessModules/officialMedicalService/shared/file/FileSheetArray";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

export function AnamnesisCard({
  isAnamnesisAnswered,
}: Readonly<{ isAnamnesisAnswered: boolean }>) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);

  return (
    <ContentSheet
      sx={{ paddingX: byBreakpoint({ mobile: 0, desktop: 3 }) }}
      data-testid="anamnesis-card"
    >
      <ContentSheetTitle sx={{ px: byBreakpoint({ mobile: 2, desktop: 0 }) }}>
        {t("anamnesis.title")}
      </ContentSheetTitle>
      <Sheet
        variant="soft"
        sx={{
          borderRadius: byBreakpoint({
            mobile: theme.radius.xs,
            desktop: theme.radius.md,
          }),
          paddingX: byBreakpoint({ mobile: 0, desktop: 3 }),
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <HeaderGrid>
          <IndicatorIcon
            type={isAnamnesisAnswered ? "check" : "close"}
            sx={{ gridArea: "indicatorIcon" }}
          />
          <Box sx={{ gridArea: "label" }}>
            <Typography sx={{ fontWeight: theme.fontWeight.lg }}>
              {t("anamnesis.file.title")}
            </Typography>
            <Typography data-testid="status">
              {isAnamnesisAnswered
                ? t("anamnesis.file.helperText_SUMBITTED")
                : t("anamnesis.file.helperText_MISSING")}
            </Typography>
          </Box>
          {!isAnamnesisAnswered && (
            <Box
              sx={{
                gridArea: "uploadButton",
                justifySelf: "end",
                width: "100%",
              }}
            >
              <InternalLinkButton
                variant="outlined"
                fullWidth
                startDecorator={<UploadOutlined />}
                href={""}
                sx={{ backgroundColor: "white", height: "40px" }}
              >
                {t("anamnesis.file.placeholder")}
              </InternalLinkButton>
            </Box>
          )}
        </HeaderGrid>
      </Sheet>
    </ContentSheet>
  );
}
