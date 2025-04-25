/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { styled } from "@mui/joy";

import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";

import { useGetDepartmentLogo } from "@/lib/shared/api/queries/department";
import { MobileBreakpoint } from "@/lib/shared/breakpoints";

const LogoImage = styled("img")(({ theme }) => ({
  height: 80,
  width: "auto",
  [theme.breakpoints.down(MobileBreakpoint.Down)]: {
    height: 44,
  },
}));

export function HeaderLogo() {
  const departmentLogo = useGetDepartmentLogo();

  return (
    <NavigationLink href="/">
      <LogoImage src={departmentLogo.data} alt="logo" />
    </NavigationLink>
  );
}
