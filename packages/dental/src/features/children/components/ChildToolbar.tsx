/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  FormatListBulletedOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ApiProcedureStatus, ApiUserRole } from "@eshg/base-api";
import {
  PROCEDURE_STATUS_COLORS,
  PROCEDURE_STATUS_NAMES,
  PersonToolbarHeader,
  TabNavigationItem,
  TabNavigationToolbar,
  ToolbarBackButton,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";

import { routes } from "../../../config/routes";
import { useDentalApi } from "../../../contexts/dental";
import { getChildDetailsQuery } from "../api/queries/details";

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
      backButton={
        hasDentalAdminRole ? (
          <ToolbarBackButton href={routes.children.overview} />
        ) : null
      }
      items={buildTabItems(childId)}
      afterTabs={
        child.isClosed ? (
          <Chip color={PROCEDURE_STATUS_COLORS[ApiProcedureStatus.Closed]}>
            {PROCEDURE_STATUS_NAMES[ApiProcedureStatus.Closed]}
          </Chip>
        ) : null
      }
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
