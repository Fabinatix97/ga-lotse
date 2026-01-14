/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  FormatListBulleted,
  TextSnippetOutlined,
  TimelineOutlined,
} from "@mui/icons-material";

import { ApiUserRole } from "@eshg/base-api";
import {
  TabNavigationItem,
  TabNavigationToolbar,
  ToolbarBackButton,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";

import { routes } from "../../../config/routes";
import { useDecryptedPersons } from "../../../contexts/decryptedPersons/DecryptedPersonsStoreProvider";

import { ProcedureTabHeader } from "./ProcedureTabHeader";

interface ProcedureToolbarProps {
  procedureId: string;
}

export function ProcedureToolbar({ procedureId }: ProcedureToolbarProps) {
  const { getDecryptedPerson } = useDecryptedPersons();
  const personData = getDecryptedPerson(procedureId);

  const hasProstituteProtectionAdminRole = useHasUserRoleCheck(
    ApiUserRole.ProstituteProtectionAdmin,
  );
  const tabItems = buildTabItems(procedureId);

  const backRoute = personData?.id
    ? routes.searchPerson.index
    : routes.procedures.index;

  return (
    <TabNavigationToolbar
      header={<ProcedureTabHeader procedureId={procedureId} />}
      backButton={
        hasProstituteProtectionAdminRole ? (
          <ToolbarBackButton href={backRoute} />
        ) : null
      }
      items={tabItems}
    />
  );
}

function buildTabItems(procedureId: string): TabNavigationItem[] {
  return [
    {
      tabButtonName: "Vorgangsdaten",
      href: routes.procedures.byId(procedureId).details,
      decorator: <TextSnippetOutlined />,
    },
    {
      tabButtonName: "Beratung",
      href: routes.procedures.byId(procedureId).consultation,
      decorator: <FormatListBulleted />,
    },
    {
      tabButtonName: "Verlaufseinträge",
      href: routes.procedures.byId(procedureId).progressEntries,
      decorator: <TimelineOutlined />,
    },
  ];
}
