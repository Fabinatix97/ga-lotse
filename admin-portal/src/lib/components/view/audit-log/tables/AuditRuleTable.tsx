/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAdminActorSelector,
  ApiPairAdminPartialRule,
} from "@eshg/admin-portal-api/serviceDirectory";
import { createColumnHelper } from "@tanstack/react-table";

import { AuditCell } from "@/lib/components/table/cell/AuditCell";
import { RevisionTypeCell } from "@/lib/components/table/cell/RevisionTypeCell";
import { AuditTable } from "@/lib/components/view/audit-log/tables/AuditTable";
import { RevisionType } from "@/lib/types/audit";

interface RuleDiff {
  id: string;
  revisionType: RevisionType;
  active: { old?: boolean; new?: boolean };
  description: { old?: string; new?: string };
  client: { old?: ApiAdminActorSelector; new?: ApiAdminActorSelector };
  server: { old?: ApiAdminActorSelector; new?: ApiAdminActorSelector };
}

const columnHelper = createColumnHelper<RuleDiff>();
// eslint-disable-next-line func-style
const accessor: (typeof columnHelper)["accessor"] = (a, c) => {
  const id = c.id ?? String(a);
  return columnHelper.accessor(a, {
    id,
    header: `ruleColumnHeader.${String(a)}`,
    ...c,
  });
};

const columns = [
  columnHelper.accessor("revisionType", {
    header: "",
    enableGlobalFilter: false,
    cell: RevisionTypeCell,
  }),
  accessor("description", {
    cell: AuditCell,
    enableGlobalFilter: false,
  }),
  accessor("client", {
    cell: AuditCell,
    enableGlobalFilter: false,
  }),
  accessor("server", {
    cell: AuditCell,
    enableGlobalFilter: false,
  }),
  accessor("active", {
    cell: AuditCell,
    enableGlobalFilter: false,
  }),
];

function getRevisionType(ou: ApiPairAdminPartialRule) {
  return ou.newEntity ? RevisionType.MOD : RevisionType.DEL;
}

export function AuditRuleTable({
  rulePairs,
}: Readonly<{
  rulePairs: ApiPairAdminPartialRule[];
}>) {
  const data: RuleDiff[] = rulePairs.map((ou) => ({
    id: ou.oldEntity?.id ?? ou.newEntity!.id!,
    revisionType: ou.oldEntity ? getRevisionType(ou) : RevisionType.ADD,
    active: { old: ou.oldEntity?.active, new: ou.newEntity?.active },
    description: {
      old: ou.oldEntity?.description,
      new: ou.newEntity?.description,
    },
    client: { old: ou.oldEntity?.client, new: ou.newEntity?.client },
    server: {
      old: ou.oldEntity?.server,
      new: ou.newEntity?.server,
    },
  }));

  return <AuditTable columns={columns} data={data} title="ruleHeader" />;
}
