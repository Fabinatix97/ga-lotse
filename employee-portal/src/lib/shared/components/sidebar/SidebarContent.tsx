/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Alert, AlertProps } from "@eshg/lib-portal/components/Alert";
import { AlertSlot } from "@eshg/lib-portal/errorHandling/AlertContext";
import { Box, DialogTitle, Stack, Typography, styled } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined, isNonNullish } from "remeda";

import { sidebarPadding } from "@/lib/shared/components/sidebar/Sidebar";

const AlertContainer = styled("div")(({ theme }) => ({
  paddingInline: theme.spacing(sidebarPadding),
}));

export interface SidebarContentProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  alert?: AlertProps;
  header?: ReactNode; // use `DialogTitle` in the header if possible for automatic aria-labelledby
  footer?: ReactNode;
  verticallyCenterContent?: boolean;
}

export function SidebarContent({
  children,
  title,
  subtitle,
  alert,
  header,
  footer,
  verticallyCenterContent,
}: SidebarContentProps) {
  return (
    <Stack
      flex={1}
      gap={3}
      sx={{
        paddingTop: 2,
        marginRight: -sidebarPadding,
        marginLeft: -sidebarPadding,
        overflow: "hidden",
      }}
      data-testid="sidebarContent"
    >
      {title && (
        <Stack gap={1} sx={{ paddingLeft: sidebarPadding }}>
          <DialogTitle level="h3" component="h1">
            {title}
          </DialogTitle>
          {subtitle && (
            <Typography
              level={"title-sm"}
              color={"neutral"}
              data-testid={"sidebarContent.subtitle"}
            >
              {subtitle}
            </Typography>
          )}
        </Stack>
      )}
      {isNonNullish(header) && (
        <Stack sx={{ paddingLeft: sidebarPadding }}>{header}</Stack>
      )}
      {isDefined(alert) ? (
        <AlertContainer>
          <Alert {...alert} />
        </AlertContainer>
      ) : (
        <AlertSlot container={AlertContainer} />
      )}
      <Stack
        flex={1}
        justifyContent={verticallyCenterContent ? "center" : undefined}
        sx={{ overflow: "hidden auto", position: "relative" }}
      >
        <Box
          sx={{
            paddingRight: sidebarPadding,
            paddingLeft: sidebarPadding,
            flex: 1,
          }}
        >
          {children}
        </Box>
      </Stack>
      {isNonNullish(footer) && (
        <Stack sx={{ paddingLeft: sidebarPadding }}>{footer}</Stack>
      )}
    </Stack>
  );
}
