/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SideNavigationItem,
  useAccessControl,
} from "@eshg/lib-employee-portal";
import { ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { filterNavigationItemsWithAccess } from "@/lib/baseModule/components/layout/sideNavigation/filterNavigationItemsWithAccess";
import {
  CollapsedNavigationErrorItem,
  CollapsedNavigationLinkItem,
  CollapsedNavigationLoadingItem,
  CollapsedNavigationParentItem,
} from "@/lib/baseModule/components/layout/sideNavigation/items/CollapsedNavigationItem";
import {
  ExpandedNavigationErrorItem,
  ExpandedNavigationLinkItem,
  ExpandedNavigationLoadingItem,
  ExpandedNavigationParentItem,
} from "@/lib/baseModule/components/layout/sideNavigation/items/ExpandedNavigationItem";
import { useNavigationListContext } from "@/lib/baseModule/components/layout/sideNavigation/lists/NavigationListContext";
import { useSideNavigationItemProps } from "@/lib/baseModule/components/layout/sideNavigation/useSideNavigationItemProps";

function useNavigationItemComponents() {
  const collapsed = useNavigationListContext();

  if (collapsed) {
    return {
      LinkItem: CollapsedNavigationLinkItem,
      ParentItem: CollapsedNavigationParentItem,
      ErrorItem: CollapsedNavigationErrorItem,
      LoadingItem: CollapsedNavigationLoadingItem,
    };
  }
  return {
    LinkItem: ExpandedNavigationLinkItem,
    ParentItem: ExpandedNavigationParentItem,
    ErrorItem: ExpandedNavigationErrorItem,
    LoadingItem: ExpandedNavigationLoadingItem,
  };
}

export function NavigationItem(props: { item: SideNavigationItem }): ReactNode {
  const checkAccess = useAccessControl();
  const { LinkItem, ParentItem, ErrorItem, LoadingItem } =
    useNavigationItemComponents();
  const sideNavigationItemProps = useSideNavigationItemProps();

  const [item] = filterNavigationItemsWithAccess([props.item], checkAccess);
  if (item === undefined) {
    return undefined;
  }

  switch (item.type) {
    case "SideNavigationLinkItem": {
      return <LinkItem item={item} />;
    }
    case "SideNavigationParentItem": {
      return <ParentItem item={item} />;
    }
    case "SideNavigationSuspenseItem": {
      const ItemComponent = item.component;
      return (
        <ErrorBoundary fallback={<ErrorItem item={item} />}>
          <Suspense fallback={<LoadingItem item={item} />}>
            <ItemComponent {...sideNavigationItemProps} />
          </Suspense>
        </ErrorBoundary>
      );
    }
  }
}
