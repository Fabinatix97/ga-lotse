/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { TableOptions, createColumnHelper } from "@tanstack/react-table";

import {
  ApiAdminOrgUnitType,
  ApiFederalState,
} from "@eshg/service-directory-api";

import { OrgUnitSidebarContent } from "@/lib/components/sidebar/SidebarContent";
import { EditableTable } from "@/lib/components/table/EditableTable";
import {
  actorsFilterFn,
  arrIncludesSomeFilterFn,
  equalsFilterFn,
  getFilterFn,
  includesStringFilterFn,
} from "@/lib/components/table/Filter";
import { ActiveCell } from "@/lib/components/table/cell/ActiveCell";
import { ActorsCell } from "@/lib/components/table/cell/ActorsCell";
import { getEditButtonColumnDef } from "@/lib/components/table/cell/EditButtonCell";
import { getToggleExpandColumn } from "@/lib/components/table/cell/ExpandButtonCell";
import { PageContent } from "@/lib/components/view/PageContent";
import { entityToString } from "@/lib/helpers/entityToString";
import {
  NEW_ENTITY_PARENT_ID,
  OrgUnit,
  canonicalColumnId,
  isCommittedEntity,
  isStagedEntity,
  useEntities,
  useEntitiesQuery,
} from "@/lib/hooks/useEntities";

const columnHelper = createColumnHelper<OrgUnit>();
// eslint-disable-next-line func-style
const accessor: (typeof columnHelper)["accessor"] = (a, c) => {
  const id = c.id ?? String(a);
  return columnHelper.accessor(a, {
    id,
    header: `orgUnitColumnHeader.${canonicalColumnId(id)}`,
    ...c,
    filterFn: getFilterFn(c.filterFn, [NEW_ENTITY_PARENT_ID]),
  });
};

const columns: TableOptions<OrgUnit>["columns"] = [
  getToggleExpandColumn(),
  accessor(
    (row) =>
      isStagedEntity(row)
        ? `${row.author} (${row.id})`
        : entityToString(row, true),
    {
      id: "id",
      enableColumnFilter: true,
      filterFn: includesStringFilterFn,
    },
  ),
  accessor("entity.federalState", {
    enableColumnFilter: true,
    filterFn: arrIncludesSomeFilterFn,
    meta: {
      options: Object.values(ApiFederalState),
      multiFilter: true,
    },
  }),
  accessor("entity.type", {
    enableColumnFilter: true,
    filterFn: arrIncludesSomeFilterFn,
    meta: {
      options: Object.values(ApiAdminOrgUnitType),
      multiFilter: true,
    },
  }),
  accessor("entity.readableName", {
    enableColumnFilter: true,
    filterFn: includesStringFilterFn,
  }),
  accessor("entity.active", {
    enableColumnFilter: true,
    filterFn: equalsFilterFn,
    cell: ActiveCell,
    meta: {
      options: [false, true],
      stringToValue: (v) => v === "true",
    },
  }),
  accessor("entity._actors", {
    enableColumnFilter: true,
    filterFn: actorsFilterFn,
    cell: ActorsCell,
  }),
  getEditButtonColumnDef(),
];

export function OrgUnitTable() {
  return (
    <PageContent
      title="orgUnitHeader"
      query={useEntitiesQuery()}
      renderContent={() => <OrgUnitTableContent />}
    />
  );
}

function OrgUnitTableContent() {
  const { committedOrgUnits } = useEntities();

  return (
    <EditableTable
      columns={columns}
      data={committedOrgUnits}
      getSubRows={getSubRows}
      type="orgUnit"
      sidebarContent={OrgUnitSidebarContent}
    />
  );
}

function getSubRows(originalRow: OrgUnit): OrgUnit[] | undefined {
  if (isCommittedEntity(originalRow)) {
    return originalRow._staged;
  }
}
