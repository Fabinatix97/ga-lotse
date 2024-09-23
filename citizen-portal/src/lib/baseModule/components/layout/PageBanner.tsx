/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Typography, useTheme } from "@mui/joy";

import { Content } from "@/lib/baseModule/components/layout/Content";
import { useTranslation } from "@/lib/i18n/client";
import { useGetDepartmentInfo } from "@/lib/shared/api/queries/department";

export function PageBanner() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: department } = useGetDepartmentInfo();

  return (
    <Box
      sx={{
        height: 320,
        display: "flex",
        alignItems: "center",
        width: "100%",
        position: "relative",
        [theme.breakpoints.down("md")]: {
          height: "124px",
        },
      }}
    >
      <Content>
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
                backgroundImage: `linear-gradient(93.08deg, rgba(128, 120, 255, 0.9) 0.43%, rgba(11, 107, 203, 0.9) 33.45%, rgba(51, 154, 254, 0.9) 57.18%, rgba(28, 224, 253, 0.9) 84.52%)`,
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
            <Box display="flex" justifyContent="space-between">
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
      </Content>
    </Box>
  );
}
