/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";

import { useGetDepartmentLogo } from "@/lib/shared/api/queries/department";

export function HeaderLogo() {
  const departmentLogo = useGetDepartmentLogo();

  return (
    <NavigationLink href="/">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={departmentLogo.data} alt="logo" />
    </NavigationLink>
  );
}
