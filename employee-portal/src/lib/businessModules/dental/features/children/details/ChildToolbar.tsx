/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { routes } from "@eshg/dental/shared/routes";
import {
  FormatListBulletedOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from "@mui/icons-material";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useChildApi } from "@/lib/businessModules/dental/api/clients";
import { getChildDetailsQuery } from "@/lib/businessModules/dental/api/queries/childApi";
import { PersonToolbarHeader } from "@/lib/shared/components/layout/PersonToolbarHeader";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import { TabNavigationToolbar } from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

interface ChildToolbarProps {
  childId: string;
}

export function ChildToolbar(props: ChildToolbarProps) {
  const { childId } = props;
  const hasDentalAdminRole = useHasUserRoleCheck(ApiUserRole.DentalAdmin);
  const childApi = useChildApi();
  const { data: child } = useSuspenseQuery(
    getChildDetailsQuery(childApi, childId),
  );

  return (
    <TabNavigationToolbar
      header={<PersonToolbarHeader person={child} />}
      routeBack={hasDentalAdminRole ? routes.children.overview : undefined}
      items={buildTabItems(childId)}
    />
  );
}

function buildTabItems(childId: string): TabNavigationItem[] {
  return [
    {
      tabButtonName: "Kindsdaten",
      href: routes.children.byId(childId).details,
      decorator: <TextSnippetOutlined />,
    },
    {
      tabButtonName: "Untersuchungen",
      href: routes.children.byId(childId).examinations.overview,
      decorator: <FormatListBulletedOutlined />,
    },
    {
      tabButtonName: "Verlaufseinträge",
      href: routes.children.byId(childId).progressEntries,
      decorator: <TimelineOutlined />,
    },
  ];
}
