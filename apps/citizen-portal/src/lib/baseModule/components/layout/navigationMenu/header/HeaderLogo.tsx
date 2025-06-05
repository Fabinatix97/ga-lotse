/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ComponentType, ImgHTMLAttributes } from "react";

import { NavigationLink } from "@eshg/lib-portal";

import { useGetDepartmentLogo } from "@/lib/shared/api/queries/department";
import { MobileBreakpoint } from "@/lib/shared/breakpoints";

interface HeaderLogoProps<TLogoImageProps> {
  slots?: { logoImage: ComponentType<ImgHTMLAttributes<TLogoImageProps>> };
  slotProps?: { navLink?: { sx?: SxProps } };
}
const LogoImage = styled("img")(({ theme }) => ({
  height: 80,
  width: "auto",
  [theme.breakpoints.down(MobileBreakpoint.Down)]: {
    height: 44,
  },
  display: "inline-block",
  verticalAlign: "middle",
}));

export function HeaderLogo<TLogoImageProps>(
  props: HeaderLogoProps<TLogoImageProps>,
) {
  const departmentLogo = useGetDepartmentLogo();
  const LogoComponent = props.slots?.logoImage ?? LogoImage;

  return (
    <NavigationLink href="/" {...props.slotProps?.navLink}>
      <LogoComponent src={departmentLogo.data} alt="logo" />
    </NavigationLink>
  );
}

export const LogoImageReduced = styled("img")(({ theme }) => ({
  height: 50,
  width: "auto",
  [theme.breakpoints.down(MobileBreakpoint.Down)]: {
    height: 44,
  },
  display: "inline-block",
  verticalAlign: "middle",
}));
