/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  TableOptions,
  createColumnHelper,
  filterFns,
} from "@tanstack/react-table";

import { ApiAdminActorType } from "@eshg/service-directory-api";

import { ActorSidebarContent } from "@/lib/components/sidebar/SidebarContent";
import { EditableTable } from "@/lib/components/table/EditableTable";
import {
  getFilterFn,
  matchingClientRulesFilterFn,
  matchingServerRulesFilterFn,
  orgUnitFilterFn,
} from "@/lib/components/table/Filter";
import { ActiveCell } from "@/lib/components/table/cell/ActiveCell";
import { getEditButtonColumnDef } from "@/lib/components/table/cell/EditButtonCell";
import { getToggleExpandColumn } from "@/lib/components/table/cell/ExpandButtonCell";
import { OrgUnitCell } from "@/lib/components/table/cell/OrgUnitCell";
import { PageContent } from "@/lib/components/view/PageContent";
import { entityToString } from "@/lib/helpers/entityToString";
import {
  Actor,
  NEW_ENTITY_PARENT_ID,
  canonicalColumnId,
  isCommittedEntity,
  isStagedEntity,
  useEntities,
  useEntitiesQuery,
} from "@/lib/hooks/useEntities";

const columnHelper = createColumnHelper<Actor>();
// eslint-disable-next-line func-style
const accessor: (typeof columnHelper)["accessor"] = (a, c) => {
  const id = c.id ?? String(a);
  return columnHelper.accessor(a, {
    id,
    header: `actorColumnHeader.${canonicalColumnId(id)}`,
    ...c,
    filterFn: getFilterFn(c.filterFn, [NEW_ENTITY_PARENT_ID]),
  });
};

const columns: TableOptions<Actor>["columns"] = [
  getToggleExpandColumn(),
  accessor(
    (row) =>
      isStagedEntity(row)
        ? `${row.author} (${row.id})`
        : entityToString(row, true),
    {
      id: "id",
      enableColumnFilter: true,
      filterFn: filterFns.includesString,
    },
  ),
  accessor("entity.readableName", {
    enableColumnFilter: true,
    filterFn: filterFns.includesString,
  }),
  accessor("entity._orgUnit", {
    enableColumnFilter: true,
    filterFn: orgUnitFilterFn,
    cell: OrgUnitCell,
  }),
  accessor("entity.type", {
    enableColumnFilter: true,
    filterFn: filterFns.arrIncludesSome,
    meta: {
      options: Object.values(ApiAdminActorType),
      multiFilter: true,
    },
  }),
  accessor("entity.active", {
    enableColumnFilter: true,
    filterFn: filterFns.equals,
    cell: ActiveCell,
    meta: {
      options: [false, true],
      stringToValue: (v) => v === "true",
    },
  }),
  accessor("entity._matchingClientRules", {
    enableColumnFilter: true,
    filterFn: matchingClientRulesFilterFn,
  }),
  accessor("entity._matchingServerRules", {
    enableColumnFilter: true,
    filterFn: matchingServerRulesFilterFn,
  }),
  getEditButtonColumnDef(),
];

export function ActorTable() {
  return (
    <PageContent
      title="actorHeader"
      query={useEntitiesQuery()}
      renderContent={() => <ActorTableContent />}
    />
  );
}

function ActorTableContent() {
  const { committedActors } = useEntities();

  return (
    <EditableTable
      columns={columns}
      data={committedActors}
      getSubRows={getSubRows}
      type="actor"
      columnVisibility={{
        "entity._matchingServerRules": false,
        "entity._matchingClientRules": false,
      }}
      sidebarContent={ActorSidebarContent}
    />
  );
}

function getSubRows(originalRow: Actor): Actor[] | undefined {
  if (isCommittedEntity(originalRow)) {
    return originalRow._staged;
  }
}
