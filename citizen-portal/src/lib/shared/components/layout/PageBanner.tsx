/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Typography, styled, useTheme } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";
import { useGetDepartmentInfo } from "@/lib/shared/api/queries/department";
import { PageContent } from "@/lib/shared/components/layout/PageContent";

export type BannerType = "private" | "business" | "general";

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
  const { data: department } = useGetDepartmentInfo();

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
        [theme.breakpoints.down("md")]: {
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
        <Box
          sx={{
            display: "flex",
            [theme.breakpoints.down("md")]: {
              justifyContent: "center",
            },
          }}
        >
          <h1
            style={{
              flexBasis: "content",
              display: "flex",
              flexDirection: "column",
              margin: "0",
            }}
          >
            <Typography
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
              fontSize={{ xxs: "2rem", md: "6.25rem" }}
              fontWeight="900"
              lineHeight="0.8"
              component="span"
              textTransform="uppercase"
            >
              {t("health_department_title")}&nbsp;
            </Typography>
            <Box display="flex">
              <Box />
              <Typography
                component="span"
                sx={{
                  textAlign: "right",
                }}
                fontSize={{ xxs: "1.75rem", md: "3rem" }}
                fontWeight="700"
                lineHeight={{ xxs: "1.2", md: "1.33" }}
                textAlign="right"
              >
                {department.city}
              </Typography>
            </Box>
          </h1>
        </Box>
      </PageContent>
    </Box>
  );
}
