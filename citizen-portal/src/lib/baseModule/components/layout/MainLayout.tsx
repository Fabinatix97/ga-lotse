/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box } from "@mui/joy";
import { ReactNode } from "react";

import { Content } from "@/lib/baseModule/components/layout/Content";
import { Footer } from "@/lib/baseModule/components/layout/Footer";
import { useGetDepartmentInfo } from "@/lib/shared/api/queries/department";

import { NavigationMenu } from "./navigationMenu/NavigationMenu";

export function MainLayout({ children }: { children: ReactNode }) {
  const { data: department } = useGetDepartmentInfo();
  return (
    <>
      <NavigationMenu />
      <Content>
        <Box component="main">{children}</Box>
      </Content>
      <Footer department={department} />
    </>
  );
}
