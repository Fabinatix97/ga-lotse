/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Typography, styled, useTheme } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";
import { MobileBreakpoint, byBreakpoint } from "@/lib/shared/breakpoints";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { useDepartmentName } from "@/lib/shared/hooks/useDepartmentName";

export type BannerType = "private" | "business" | "general" | "reduced";

interface PageBannerProps {
  type: BannerType;
}

const BannerPicture = styled("picture")({
  zIndex: -1,
  position: "absolute",
  width: "100%",
  height: "100%",
});

const BannerImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

export function PageBanner(props: PageBannerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const name = useDepartmentName();

  if (props.type === "reduced") {
    return <PageBannerReduced />;
  }
  return (
    <Box
      sx={{
        height: 320,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        position: "relative",
        [theme.breakpoints.down(MobileBreakpoint.Down)]: {
          height: 124,
        },
        overflow: "hidden",
      }}
    >
      <BannerPicture>
        <source
          srcSet={`/${props.type}Banner3460x640.png`}
          media="(min-width: 1731px)"
        />
        <source
          srcSet={`/${props.type}Banner1730x320.png`}
          media="(min-width: 721px)"
        />
        <BannerImage
          src={`/${props.type}Banner720x248.png`}
          aria-hidden="true"
        />
      </BannerPicture>
      <PageContent>
        <Box marginInline={3}>
          <Title
            sx={{
              backgroundImage:
                props.type === "general"
                  ? `linear-gradient(93.08deg, rgba(128, 120, 255, 0.9) 0.43%, rgba(11, 107, 203, 0.9) 33.45%, rgba(51, 154, 254, 0.9) 57.18%, rgba(28, 224, 253, 0.9) 84.52%)`
                  : `linear-gradient(89.95deg, #0B9DA6 0.09%, #00B8EC 50.5%, #7FC078 99.91%)`,
              backgroundSize: "100%",
              backgroundRepeat: "repeat",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            fontWeight="900"
            lineHeight="0.8"
            textTransform="uppercase"
          >
            {t("health_department_title")}&nbsp;
          </Title>
          <Typography
            fontWeight="700"
            fontSize={byBreakpoint({
              mobile: "1.75rem",
              desktop: "3rem",
            })}
            lineHeight={byBreakpoint({
              mobile: "1.2",
              desktop: "1.33",
            })}
          >
            {name}
          </Typography>
        </Box>
      </PageContent>
    </Box>
  );
}

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "6.25rem",
  [theme.breakpoints.down("lg")]: {
    fontSize: "6rem",
  },
  [theme.breakpoints.down("md")]: {
    fontSize: "2rem",
  },
}));

function PageBannerReduced() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        position: "relative",
        [theme.breakpoints.down(MobileBreakpoint.Down)]: { display: "none" },
        overflow: "hidden",
      }}
    >
      <BannerPicture>
        <BannerImage src="/reducedBanner1728x24.png" aria-hidden="true" />
      </BannerPicture>
    </Box>
  );
}
