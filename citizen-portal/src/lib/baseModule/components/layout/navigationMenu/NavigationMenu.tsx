/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import {
  NavigationState,
  UserType,
} from "@/lib/baseModule/components/layout/types";
import {
  useResolveCitizenNavigationItems,
  useResolveOrganizationNavigationItems,
} from "@/lib/baseModule/moduleRegister/navigationItemsResolver";
import { useRoutes } from "@/lib/baseModule/shared/routes";

import { Header } from "./header/Header";
import { SideNavigation } from "./sideNavigation/SideNavigation";

const initialNavigationState: NavigationState = { type: "closed" };

export function NavigationMenu() {
  const [navigationState, setNavigationState] = useState<NavigationState>(
    initialNavigationState,
  );

  const routes = useRoutes();
  const pathname = usePathname();
  const userType: UserType = pathname.startsWith(routes.organizationPath.index)
    ? "organization"
    : "person";
  const organizationNavigationItems = useResolveOrganizationNavigationItems();
  const citizenNavigationItems = useResolveCitizenNavigationItems();
  const navigationItems =
    userType === "organization"
      ? organizationNavigationItems
      : citizenNavigationItems;

  const props = {
    navigationState,
    setNavigationState,
    navigationItems,
    userType,
  };

  return (
    <>
      <NavigationEvents setNavigationState={setNavigationState} />
      <Header {...props} />
      <SideNavigation {...props} />
    </>
  );
}

function NavigationEvents({
  setNavigationState,
}: {
  setNavigationState: Dispatch<SetStateAction<NavigationState>>;
}) {
  const pathname = usePathname();

  useEffect(() => {
    setNavigationState({ type: "closed" });
  }, [pathname, setNavigationState]);

  return null;
}
