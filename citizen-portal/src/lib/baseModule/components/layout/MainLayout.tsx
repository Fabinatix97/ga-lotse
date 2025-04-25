/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { styled } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { Footer } from "@/lib/baseModule/components/layout/Footer";
import { NavigationMenu } from "@/lib/baseModule/components/layout/navigationMenu/NavigationMenu";
import { useGetDepartmentInfo } from "@/lib/shared/api/queries/department";

const FullWidthContainer = styled("div")({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  alignItems: "center",
});

export function MainLayout({ children }: RequiresChildren) {
  const { data: department } = useGetDepartmentInfo();
  return (
    <>
      <NavigationMenu />
      <FullWidthContainer>{children}</FullWidthContainer>
      <Footer department={department} />
    </>
  );
}
