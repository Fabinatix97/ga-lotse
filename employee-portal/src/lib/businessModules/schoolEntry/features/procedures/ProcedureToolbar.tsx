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
  ToolbarBackButton,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import {
  FormatListBulletedOutlined,
  MedicalServicesOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
  VaccinesOutlined,
} from "@mui/icons-material";

import { useGetProcedure } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

interface ProcedureToolbarProps {
  procedureId: string;
}

export function ProcedureToolbar(props: ProcedureToolbarProps) {
  const hasSchoolEntryAdminRole = useHasUserRoleCheck(
    ApiUserRole.SchoolEntryAdmin,
  );
  const procedure = useGetProcedure(props.procedureId);
  const tabItems = buildTabItems(props.procedureId);

  return (
    <TabNavigationToolbar
      header={<PersonToolbarHeader person={procedure.data.child} />}
      items={tabItems}
      afterTabs={
        procedure.data.isClosed ? (
          <span data-testid="procedureStatus">Vorgang geschlossen</span>
        ) : null
      }
      backButton={
        hasSchoolEntryAdminRole ? (
          <ToolbarBackButton href={routes.procedures.overview} />
        ) : null
      }
    />
  );
}

function buildTabItems(id: string): TabNavigationItem[] {
  return [
    {
      tabButtonName: "Vorgangsdaten",
      href: routes.procedures.byId(id).details,
      decorator: <TextSnippetOutlined />,
    },
    {
      tabButtonName: "S1 - Anamnese",
      href: routes.procedures.byId(id).anamnesis,
      decorator: <FormatListBulletedOutlined />,
    },
    {
      tabButtonName: "Impfstatus",
      href: routes.procedures.byId(id).vaccination,
      decorator: <VaccinesOutlined />,
    },
    {
      tabButtonName: "Untersuchung",
      href: routes.procedures.byId(id).examinations.index,
      decorator: <MedicalServicesOutlined />,
    },
    {
      tabButtonName: "Verlaufseinträge",
      href: routes.procedures.byId(id).progressEntries,
      decorator: <TimelineOutlined />,
    },
  ];
}
