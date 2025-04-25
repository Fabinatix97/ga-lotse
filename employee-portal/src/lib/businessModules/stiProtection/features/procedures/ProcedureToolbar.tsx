/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  FormatListBulletedOutlined,
  MedicalServicesOutlined,
  SubjectOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/joy";
import { useIsFetching } from "@tanstack/react-query";

import { ApiUserRole } from "@eshg/base-api";
import {
  TabNavigationItem,
  TabNavigationToolbar,
  ToolbarBackButton,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";

import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { PersonDocumentConsultation } from "@/lib/shared/components/icons/PersonDocumentConsultation";

import { ProcedureTabHeader } from "./ProcedureTabHeader";

export function ProcedureToolbar({
  procedureId,
}: Readonly<{ procedureId: string }>) {
  const hasStiProtectionAdminRole = useHasUserRoleCheck(
    ApiUserRole.StiProtectionAdmin,
  );
  const tabItems = buildTabItems(procedureId);

  return (
    <TabNavigationToolbar
      header={<ProcedureTabHeader procedureId={procedureId} />}
      items={tabItems}
      afterTabs={<DisplayLoadingState />}
      backButton={
        hasStiProtectionAdminRole ? (
          <ToolbarBackButton href={routes.procedures.index} />
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
      tabButtonName: "Anamnese",
      href: routes.procedures.byId(id).anamnesis,
      decorator: <FormatListBulletedOutlined />,
    },
    {
      tabButtonName: "Konsultation",
      href: routes.procedures.byId(id).consultation,
      decorator: <PersonDocumentConsultation />,
    },
    {
      tabButtonName: "Tests",
      href: routes.procedures.byId(id).examination.index,
      decorator: <MedicalServicesOutlined />,
    },
    {
      tabButtonName: "Diagnose",
      href: routes.procedures.byId(id).diagnosis,
      decorator: <SubjectOutlined />,
    },
    {
      tabButtonName: "Verlaufseinträge",
      href: routes.procedures.byId(id).progressEntries,
      decorator: <TimelineOutlined />,
    },
  ];
}

function DisplayLoadingState() {
  const isFetching = useIsFetching();

  return isFetching ? <CircularProgress /> : null;
}
