/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import {
  PersonToolbarHeader,
  TabNavigationItem,
  TabNavigationToolbar,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import {
  FormatListBulletedOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from "@mui/icons-material";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getChildDetailsQuery } from "@/api/queries/childApi";
import { routes } from "@/config/routes";
import { useDentalApi } from "@/contexts/dental";

interface ChildToolbarProps {
  childId: string;
}

export function ChildToolbar(props: ChildToolbarProps) {
  const { childId } = props;
  const hasDentalAdminRole = useHasUserRoleCheck(ApiUserRole.DentalAdmin);
  const { childApi } = useDentalApi();
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
