/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Sheet, Typography } from "@mui/joy";

import { theme } from "@/lib/baseModule/theme/theme";
import {
  FileSheetIndicator,
  HeaderGrid,
  IndicatorIcon,
} from "@/lib/businessModules/officialMedicalService/shared/file/FileSheetArray";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { ScopedInternalLinkButton } from "@/lib/shared/components/scopedLinks";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

export function AnamnesisCard({
  isAnamnesisAnswered,
}: Readonly<{ isAnamnesisAnswered: boolean }>) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

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
            type={
              isAnamnesisAnswered
                ? FileSheetIndicator.Success
                : FileSheetIndicator.Error
            }
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
              <ScopedInternalLinkButton
                variant="outlined"
                fullWidth
                href={citizenRoutes.personalArea.anamnesis(accessCode)}
                sx={{ backgroundColor: "white", height: "40px" }}
              >
                {t("anamnesis.file.placeholder")}
              </ScopedInternalLinkButton>
            </Box>
          )}
        </HeaderGrid>
      </Sheet>
    </ContentSheet>
  );
}
