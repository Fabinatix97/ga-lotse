/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { TableOptions, createColumnHelper } from "@tanstack/react-table";

import { RuleSidebarContent } from "@/lib/components/sidebar/SidebarContent";
import { EditableTable } from "@/lib/components/table/EditableTable";
import {
  equalsFilterFn,
  exactOrgUnitIdsFilterFn,
  getActorSelectorFilterFn,
  getFilterFn,
  includesStringFilterFn,
  matchingClientActorsFilterFn,
  matchingServerActorsFilterFn,
} from "@/lib/components/table/Filter";
import { ActiveCell } from "@/lib/components/table/cell/ActiveCell";
import { ActorSelectorCell } from "@/lib/components/table/cell/ActorSelectorCell";
import { getEditButtonColumnDef } from "@/lib/components/table/cell/EditButtonCell";
import { getToggleExpandColumn } from "@/lib/components/table/cell/ExpandButtonCell";
import { PageContent } from "@/lib/components/view/PageContent";
import {
  NEW_ENTITY_PARENT_ID,
  Rule,
  canonicalColumnId,
  isCommittedEntity,
  isStagedEntity,
  useEntities,
  useEntitiesQuery,
} from "@/lib/hooks/useEntities";

const columnHelper = createColumnHelper<Rule>();
// eslint-disable-next-line func-style
const accessor: (typeof columnHelper)["accessor"] = (a, c) => {
  const id = c.id ?? String(a);
  return columnHelper.accessor(a, {
    id,
    header: `ruleColumnHeader.${canonicalColumnId(id)}`,
    ...c,
    filterFn: getFilterFn(c.filterFn, [NEW_ENTITY_PARENT_ID]),
  });
};

const columns: TableOptions<Rule>["columns"] = [
  getToggleExpandColumn(),
  accessor(
    (row) => (isStagedEntity(row) ? `${row.author} (${row.id})` : row.id),
    {
      id: "id",
      enableColumnFilter: true,
      filterFn: includesStringFilterFn,
    },
  ),
  accessor("entity.description", {
    enableColumnFilter: true,
    filterFn: includesStringFilterFn,
  }),
  accessor("entity.client", {
    enableColumnFilter: true,
    filterFn: getActorSelectorFilterFn("client"),
    cell: ActorSelectorCell,
  }),
  accessor("entity._matchingClientActors", {
    enableColumnFilter: true,
    filterFn: matchingClientActorsFilterFn,
  }),
  accessor("entity.server", {
    enableColumnFilter: true,
    filterFn: getActorSelectorFilterFn("server"),
    cell: ActorSelectorCell,
  }),
  accessor("entity._matchingServerActors", {
    enableColumnFilter: true,
    filterFn: matchingServerActorsFilterFn,
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
  accessor("entity._exactOrgUnitIds", {
    enableColumnFilter: true,
    filterFn: exactOrgUnitIdsFilterFn,
  }),
  getEditButtonColumnDef(),
];

export function RuleTable() {
  return (
    <PageContent
      title="ruleHeader"
      query={useEntitiesQuery()}
      renderContent={() => <RuleTableContent />}
    />
  );
}

function RuleTableContent() {
  const { committedRules } = useEntities();

  return (
    <EditableTable
      columns={columns}
      data={committedRules}
      getSubRows={getSubRows}
      type="rule"
      columnVisibility={{
        "entity._exactOrgUnitIds": false,
        "entity._matchingClientActors": false,
        "entity._matchingServerActors": false,
      }}
      sidebarContent={RuleSidebarContent}
    />
  );
}

function getSubRows(originalRow: Rule): Rule[] | undefined {
  if (isCommittedEntity(originalRow)) {
    return originalRow._staged;
  }
}
