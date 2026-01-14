/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, styled } from "@mui/joy";
import { ComponentType, PropsWithChildren } from "react";

import { Footer } from "@/lib/baseModule/components/layout/Footer";
import { NavigationMenu } from "@/lib/baseModule/components/layout/navigationMenu/NavigationMenu";
import { NavigationProps } from "@/lib/baseModule/components/layout/types";
import { useGetDepartmentInfo } from "@/lib/shared/api/queries/department";

interface MainLayoutProps<THeaderProps> {
  slots?: {
    header?: ComponentType<THeaderProps>;
  };
}

const FullWidthContainer = styled("div")({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  alignItems: "center",
});

export function MainLayout<THeaderProps extends NavigationProps>({
  children,
  ...props
}: PropsWithChildren<MainLayoutProps<THeaderProps>>) {
  const { data: department } = useGetDepartmentInfo();

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        scrollbarGutter: "stable both-edges",
        overflowX: "clip",
      }}
    >
      <NavigationMenu slots={{ header: props.slots?.header }} />
      <FullWidthContainer>{children}</FullWidthContainer>
      <Footer department={department} />
    </Box>
  );
}
