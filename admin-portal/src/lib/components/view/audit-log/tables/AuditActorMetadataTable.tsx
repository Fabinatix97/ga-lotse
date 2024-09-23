/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiPairAdminActorMetadata } from "@eshg/admin-portal-api/serviceDirectory";
import { createColumnHelper } from "@tanstack/react-table";

import { AuditCell } from "@/lib/components/table/cell/AuditCell";
import { AuditIdCell } from "@/lib/components/table/cell/AuditIdCell";
import { RevisionTypeCell } from "@/lib/components/table/cell/RevisionTypeCell";
import { AuditTable } from "@/lib/components/view/audit-log/tables/AuditTable";
import { RevisionType } from "@/lib/types/audit";

interface ActorMetadataDiff {
  id: string;
  revisionType: RevisionType;
  changedAt: { old?: Date; new?: Date };
  content: { old?: string; new?: string };
}

const columnHelper = createColumnHelper<ActorMetadataDiff>();
// eslint-disable-next-line func-style
const accessor: (typeof columnHelper)["accessor"] = (a, c) => {
  const id = c.id ?? String(a);
  return columnHelper.accessor(a, {
    id,
    header: `actorMetadataColumnHeader.${String(a)}`,
    ...c,
  });
};

const columns = [
  columnHelper.accessor("revisionType", {
    header: "",
    enableGlobalFilter: false,
    cell: RevisionTypeCell,
    meta: {
      width: "48px",
    },
  }),
  accessor("id", {
    enableGlobalFilter: false,
    cell: AuditIdCell,
  }),
  accessor("changedAt", {
    enableGlobalFilter: false,
    cell: AuditCell,
  }),
  accessor("content", {
    enableGlobalFilter: false,
    cell: AuditCell,
  }),
];

function getRevisionType(a: ApiPairAdminActorMetadata) {
  return a.newEntity ? RevisionType.MOD : RevisionType.DEL;
}

export function AuditActorMetadataTable({
  metadataPairs,
}: Readonly<{
  metadataPairs: ApiPairAdminActorMetadata[];
}>) {
  const data: ActorMetadataDiff[] = metadataPairs.map((a) => ({
    id: a.oldEntity?.id ?? a.newEntity!.id,
    revisionType: a.oldEntity ? getRevisionType(a) : RevisionType.ADD,
    changedAt: { old: a.oldEntity?.changedAt, new: a.newEntity?.changedAt },
    content: { old: a.oldEntity?.content, new: a.newEntity?.content },
  }));

  return (
    <AuditTable columns={columns} data={data} title="actorMetadataHeader" />
  );
}
