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
import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import { ApiUserRole } from "@eshg/base-api";
import {
  PersonToolbarHeader,
  TabNavigationItem,
  TabNavigationToolbar,
  ToolbarBackButton,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";

import { ExaminationStatusChip } from "../../../components/examination/ExaminationStatusChip";
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

  const latestExamination = child.examinations[0];

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
        isDefined(latestExamination) ? (
          <ExaminationStatusChip status={latestExamination.status} />
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
