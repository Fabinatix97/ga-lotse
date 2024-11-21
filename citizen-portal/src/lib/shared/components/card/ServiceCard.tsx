/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import { CardContent, Typography } from "@mui/joy";
import Card from "@mui/joy/Card";

import { SubNavigationItem } from "@/lib/baseModule/components/layout/types";
import { GradientIcon } from "@/lib/shared/components/icon/GradientIcon";

type ServiceCardProps = Omit<SubNavigationItem, "description">;

export function ServiceCard(props: ServiceCardProps) {
  return (
    <NavigationLink
      href={props.href}
      passHref
      style={{
        flex: "1",
        minWidth: "296px",
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <GradientIcon
            style={{ width: "153px", height: "153px" }}
            iconClass={props.icon}
          />
        </div>
        <CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              level="title-md"
              textAlign="center"
              style={{
                width: "248px",
                height: "48px",
                wordWrap: "break-word",
                hyphens: "auto",
              }}
            >
              {props.name}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </NavigationLink>
  );
}
