/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, CardContent, Stack, Typography, styled } from "@mui/joy";
import Card from "@mui/joy/Card";
import { useId } from "react";

import { NavigationCardItem } from "@/lib/baseModule/components/layout/types";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { GradientIcon } from "@/lib/shared/components/icons/GradientIcon";
import { ScopedNavigationLink } from "@/lib/shared/components/scopedLinks";

export function ServiceCard(props: NavigationCardItem) {
  const nameId = useId();

  return (
    <CardLink href={props.href} passHref>
      <Card
        sx={{
          border: "none",
          borderRadius: "xl",
          boxShadow: "md",
          height: byBreakpoint({ mobile: "88px", desktop: "210px" }),
          backgroundColor: "background.body",
          "&:hover": { backgroundColor: "background.level1" },
          "&:active": { backgroundColor: "background.level2" },
        }}
      >
        <CardContent>
          <Stack
            direction={byBreakpoint({ mobile: "row", desktop: "column" })}
            sx={{
              alignItems: "center",
              textAlign: "center",
              padding: byBreakpoint({ mobile: 1, desktop: 3 }),
            }}
          >
            <Box aria-hidden>
              <GradientIcon
                sx={{
                  width: byBreakpoint({ mobile: "40px", desktop: "70px" }),
                  height: byBreakpoint({ mobile: "40px", desktop: "70px" }),
                  mb: byBreakpoint({ mobile: 0, desktop: 3 }),
                  mr: byBreakpoint({ mobile: 2, desktop: 0 }),
                }}
                iconClass={props.icon}
              />
            </Box>
            <Typography
              id={nameId}
              level="title-md"
              textAlign={byBreakpoint({ mobile: "left", desktop: "center" })}
              sx={{
                wordWrap: "break-word",
                hyphens: "auto",
              }}
            >
              {props.name}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </CardLink>
  );
}

const CardLink = styled(ScopedNavigationLink)({
  width: "100%",
  textDecoration: "none",
});
