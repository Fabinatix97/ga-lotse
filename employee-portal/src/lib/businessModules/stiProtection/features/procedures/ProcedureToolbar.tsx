/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import {
  FormatListBulletedOutlined,
  MedicalServicesOutlined,
  SubjectOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from "@mui/icons-material";

import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { PersonDocumentConsultation } from "@/lib/shared/components/icons/PersonDocumentConsultation";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import { TabNavigationToolbar } from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

import { ProcedureTabHeader } from "./ProcedureTabHeader";

export function ProcedureToolbar({
  procedureId,
}: Readonly<{ procedureId: string }>) {
  const hasStiProtectionUserRole = useHasUserRoleCheck(
    ApiUserRole.StiProtectionUser,
  );
  const tabItems = buildTabItems(procedureId);

  return (
    <TabNavigationToolbar
      items={tabItems}
      routeBack={hasStiProtectionUserRole ? routes.procedures.index : undefined}
      header={<ProcedureTabHeader procedureId={procedureId} />}
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
      tabButtonName: "Untersuchung",
      href: routes.procedures.byId(id).examination,
      decorator: <MedicalServicesOutlined />,
    },
    {
      tabButtonName: "Bericht",
      href: routes.procedures.byId(id).report,
      decorator: <SubjectOutlined />,
    },
    {
      tabButtonName: "Verlaufseinträge",
      href: routes.procedures.byId(id).progressEntries,
      decorator: <TimelineOutlined />,
    },
  ];
}
