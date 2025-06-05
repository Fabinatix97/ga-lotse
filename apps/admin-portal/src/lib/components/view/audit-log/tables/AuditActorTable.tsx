/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { createColumnHelper } from "@tanstack/react-table";

import {
  ApiAdminActorType,
  ApiAdminCertificate,
  ApiPairAdminPartialActor,
} from "@eshg/service-directory-api";

import { AuditCell } from "@/lib/components/table/cell/AuditCell";
import { RevisionTypeCell } from "@/lib/components/table/cell/RevisionTypeCell";
import { AuditTable } from "@/lib/components/view/audit-log/tables/AuditTable";
import { RevisionType } from "@/lib/types/audit";

interface ActorDiff {
  id: string;
  revisionType: RevisionType;
  active: { old?: boolean; new?: boolean };
  commonName: { old?: string; new?: string };
  certificate: { old?: ApiAdminCertificate; new?: ApiAdminCertificate };
  networkId: { old?: string; new?: string };
  _orgUnit: { old?: string; new?: string };
  readableName: { old?: string; new?: string };
  type: { old?: ApiAdminActorType; new?: ApiAdminActorType };
}

const columnHelper = createColumnHelper<ActorDiff>();
// eslint-disable-next-line func-style
const accessor: (typeof columnHelper)["accessor"] = (a, c) => {
  const id = c.id ?? String(a);
  return columnHelper.accessor(a, {
    id,
    header: `actorColumnHeader.${String(a)}`,
    ...c,
  });
};

const columns = [
  columnHelper.accessor("revisionType", {
    header: "",
    enableGlobalFilter: false,
    cell: RevisionTypeCell,
  }),
  accessor("readableName", {
    cell: AuditCell,
    enableGlobalFilter: false,
  }),
  accessor("commonName", {
    cell: AuditCell,
    enableGlobalFilter: false,
  }),
  accessor("networkId", {
    cell: AuditCell,
    enableGlobalFilter: false,
  }),
  accessor("type", {
    cell: AuditCell,
    enableGlobalFilter: false,
  }),
  accessor("active", {
    cell: AuditCell,
    enableGlobalFilter: false,
  }),
  accessor("certificate", {
    cell: AuditCell,
    enableGlobalFilter: false,
  }),
];

function getRevisionType(a: ApiPairAdminPartialActor) {
  return a.newEntity ? RevisionType.MOD : RevisionType.DEL;
}

export function AuditActorTable({
  actorPairs,
}: Readonly<{
  actorPairs: ApiPairAdminPartialActor[];
}>) {
  const data: ActorDiff[] = actorPairs.map((a) => ({
    id: a.oldEntity?.id ?? a.newEntity!.id!,
    revisionType: a.oldEntity ? getRevisionType(a) : RevisionType.ADD,
    active: { old: a.oldEntity?.active, new: a.newEntity?.active },
    commonName: { old: a.oldEntity?.commonName, new: a.newEntity?.commonName },
    certificate: {
      old: a.oldEntity?.certificate,
      new: a.newEntity?.certificate,
    },
    networkId: { old: a.oldEntity?.networkId, new: a.newEntity?.networkId },
    _orgUnit: { old: a.oldEntity?.orgUnitId, new: a.newEntity?.orgUnitId },
    readableName: {
      old: a.oldEntity?.readableName,
      new: a.newEntity?.readableName,
    },
    type: { old: a.oldEntity?.type, new: a.newEntity?.type },
  }));

  return <AuditTable columns={columns} data={data} title="actorHeader" />;
}
