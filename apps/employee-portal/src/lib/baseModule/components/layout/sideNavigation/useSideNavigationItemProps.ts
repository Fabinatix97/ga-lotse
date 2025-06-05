/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature } from "@eshg/base-api";
import { SideNavigationItemsProps } from "@eshg/lib-employee-portal";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";

export function useSideNavigationItemProps(): SideNavigationItemsProps {
  const isInboxEnabled = useIsNewFeatureEnabled(ApiBaseFeature.Inbox);

  return { isInboxEnabled };
}
