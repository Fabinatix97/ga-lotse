/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import { Box, CardContent, Typography } from "@mui/joy";
import Card from "@mui/joy/Card";
import { useId } from "react";

import { SubNavigationItem } from "@/lib/baseModule/components/layout/types";
import { GradientIcon } from "@/lib/shared/components/icons/GradientIcon";

type ServiceCardProps = Omit<SubNavigationItem, "description">;

export function ServiceCard(props: ServiceCardProps) {
  const nameId = useId();

  return (
    <NavigationLink
      href={props.href}
      passHref
      sx={{
        width: "100%",
        textDecoration: "none",
      }}
    >
      <Card
        sx={{
          radius: "radius-lg",
          padding: "92px 24px 16px 24px",
          gap: "32px",
          boxShadow: "md",
          minHeight: "400px",
        }}
      >
        <Box
          aria-hidden
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <GradientIcon
            sx={{ width: "153px", height: "153px" }}
            iconClass={props.icon}
          />
        </Box>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              id={nameId}
              level="title-md"
              textAlign="center"
              sx={{
                width: "248px",
                height: "48px",
                wordWrap: "break-word",
                hyphens: "auto",
              }}
            >
              {props.name}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </NavigationLink>
  );
}
