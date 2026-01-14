/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { createColumnHelper } from "@tanstack/react-table";

import {
  ApiAdminOrgUnitType,
  ApiFederalState,
  ApiPairAdminPartialOrgUnit,
} from "@eshg/service-directory-api";

import { AuditCell } from "@/lib/components/table/cell/audit/AuditCell";
import { RevisionTypeCell } from "@/lib/components/table/cell/audit/RevisionTypeCell";
import { AuditTable } from "@/lib/components/view/audit-log/tables/AuditTable";
import { RevisionType } from "@/lib/types/audit";

interface OrgUnitDiff {
  id: string;
  revisionType: RevisionType;
  active: { old?: boolean; new?: boolean };
  readableName: { old?: string; new?: string };
  type: { old?: ApiAdminOrgUnitType; new?: ApiAdminOrgUnitType };
  federalState: { old?: ApiFederalState; new?: ApiFederalState };
}

const columnHelper = createColumnHelper<OrgUnitDiff>();
// eslint-disable-next-line func-style
const accessor: (typeof columnHelper)["accessor"] = (a, c) => {
  const id = c.id ?? String(a);
  return columnHelper.accessor(a, {
    id,
    header: `orgUnitColumnHeader.${String(a)}`,
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
  accessor("type", {
    cell: AuditCell,
    enableGlobalFilter: false,
  }),
  accessor("federalState", {
    cell: AuditCell,
    enableGlobalFilter: false,
  }),
  accessor("active", {
    cell: AuditCell,
    enableGlobalFilter: false,
  }),
];

function getRevisionType(ou: ApiPairAdminPartialOrgUnit) {
  return ou.newEntity ? RevisionType.MOD : RevisionType.DEL;
}

export function AuditOrgUnitTable({
  orgUnitPairs,
}: Readonly<{
  orgUnitPairs: ApiPairAdminPartialOrgUnit[];
}>) {
  const data: OrgUnitDiff[] = orgUnitPairs.map((ou) => ({
    id: ou.oldEntity?.id ?? ou.newEntity!.id!,
    revisionType: ou.oldEntity ? getRevisionType(ou) : RevisionType.ADD,
    active: { old: ou.oldEntity?.active, new: ou.newEntity?.active },
    readableName: {
      old: ou.oldEntity?.readableName,
      new: ou.newEntity?.readableName,
    },
    type: { old: ou.oldEntity?.type, new: ou.newEntity?.type },
    federalState: {
      old: ou.oldEntity?.federalState,
      new: ou.newEntity?.federalState,
    },
  }));

  return <AuditTable columns={columns} data={data} title="orgUnitHeader" />;
}
