/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAdminStagedEntityAdminPartialRule,
  ApiAdminStagedEntityType,
  ApiGetRulesResponse,
} from "@eshg/admin-portal-api/serviceDirectory";
import { createColumnHelper, filterFns } from "@tanstack/react-table";
import { useMemo } from "react";

import { DeleteRow } from "@/lib/components/table/DeleteRow";
import { EditableTable } from "@/lib/components/table/EditableTable";
import {
  getActorSelectorFilterFn,
  getFilterFn,
  matchingClientActorsFilterFn,
  matchingServerActorsFilterFn,
} from "@/lib/components/table/Filter";
import { NewEntityParentRow } from "@/lib/components/table/NewEntityParentRow";
import { EditableActiveCell } from "@/lib/components/table/cell/EditableActiveCell";
import { EditableActorSelectorCell } from "@/lib/components/table/cell/EditableActorSelectorCell";
import { EditableStringCell } from "@/lib/components/table/cell/EditableStringCell";
import { PageContent } from "@/lib/components/view/PageContent";
import { useFilterActorBySelector } from "@/lib/helpers/actorSelector";
import { useAuditedActors } from "@/lib/hooks/useActors";
import {
  Rule,
  StagedRuleWithEntityId,
  useRulesQuery,
} from "@/lib/hooks/useRules";
import { useRulesApi } from "@/lib/hooks/useRulesApi";

export const NEW_RULE_PARENT_ID = "NEW_RULE_PARENT_ID";

const columnHelper = createColumnHelper<Rule>();
// eslint-disable-next-line func-style
const accessor: (typeof columnHelper)["accessor"] = (a, c) => {
  const id = c.id ?? String(a);
  return columnHelper.accessor(a, {
    id,
    header: `ruleColumnHeader.${id}`,
    ...c,
    filterFn: getFilterFn(c.filterFn, [NEW_RULE_PARENT_ID]),
  });
};

const columns = [
  accessor((row) => (row.author ? `${row.author} (${row.id})` : row.id), {
    id: "id",
    enableColumnFilter: true,
    filterFn: filterFns.includesString,
  }),
  accessor("description", {
    enableColumnFilter: true,
    filterFn: filterFns.includesString,
    cell: EditableStringCell,
    meta: {
      optional: true,
    },
  }),
  accessor("client", {
    enableColumnFilter: true,
    filterFn: getActorSelectorFilterFn("client"),
    cell: EditableActorSelectorCell,
  }),
  accessor("_matchingClientActors", {
    enableColumnFilter: true,
    filterFn: matchingClientActorsFilterFn,
    meta: { linkTo: "actors" },
  }),
  accessor("server", {
    enableColumnFilter: true,
    filterFn: getActorSelectorFilterFn("server"),
    cell: EditableActorSelectorCell,
  }),
  accessor("_matchingServerActors", {
    enableColumnFilter: true,
    filterFn: matchingServerActorsFilterFn,
    meta: { linkTo: "actors" },
  }),
  accessor("active", {
    enableColumnFilter: true,
    filterFn: filterFns.equals,
    cell: EditableActiveCell,
    meta: {
      options: [false, true],
      stringToValue: (v) => v === "true",
    },
  }),
];

export function RuleTable() {
  return (
    <PageContent
      title="ruleHeader"
      query={useRulesQuery()}
      renderContent={(data) => <RuleTableContent data={data} />}
    />
  );
}

function RuleTableContent({ data }: Readonly<{ data: ApiGetRulesResponse }>) {
  const rules = useRulesWithStagedSubRows(data);
  const { api } = useRulesApi();
  const getSubRows = useGetSubRows();

  return (
    rules && (
      <EditableTable
        columns={columns}
        data={rules}
        getSubRows={getSubRows()}
        api={api}
        initialColumnVisibility={{
          _matchingClientActors: false,
          _matchingServerActors: false,
        }}
      />
    )
  );
}

function getStagedRules(
  stagedRules: ApiAdminStagedEntityAdminPartialRule[],
  id: string | undefined,
): StagedRuleWithEntityId[] {
  return stagedRules
    .filter((sou) => sou.originalEntityId === id)
    .map((sou) => ({
      ...sou,
      entity: sou.entity ? { ...sou.entity, id: sou.id } : undefined,
    }));
}

function useRulesWithStagedSubRows(rules?: ApiGetRulesResponse) {
  const actors = useAuditedActors();
  const filterActorBySelector = useFilterActorBySelector(true);

  return useMemo<Rule[] | undefined>(() => {
    if (!rules) {
      return undefined;
    }
    const mergedRules: Rule[] = rules.rules.map((r) => ({
      ...r,
      _staged: getStagedRules(rules.stagedRules, r.id),
      _matchingClientActors: actors.filter((a) =>
        filterActorBySelector(r.client, a),
      ),
      _matchingServerActors: actors.filter((a) =>
        filterActorBySelector(r.server, a),
      ),
      _type: "rule",
    }));
    const stagedRulesWithoutOriginal = getStagedRules(
      rules.stagedRules,
      undefined,
    );
    if (stagedRulesWithoutOriginal.length) {
      mergedRules.push({
        id: NEW_RULE_PARENT_ID,
        client: {},
        server: {},
        active: false,
        _staged: stagedRulesWithoutOriginal,
        _override: NewEntityParentRow,
        _matchingClientActors: [],
        _matchingServerActors: [],
        _type: "rule",
      });
    }
    return mergedRules;
  }, [rules, actors, filterActorBySelector]);
}

function useGetSubRows() {
  const actors = useAuditedActors();
  const filterActorBySelector = useFilterActorBySelector(true);

  return () => {
    return (originalRow: Rule): Rule[] | undefined => {
      return originalRow._staged.map((sr) => {
        if (sr.entity) {
          const rule = sr.entity;
          const _matchingClientActors = actors.filter((a) =>
            filterActorBySelector(rule.client, a),
          );
          const _matchingServerActors = actors.filter((a) =>
            filterActorBySelector(rule.server, a),
          );
          return {
            ...rule,
            id: sr.id,
            _staged: [],
            author: sr.author,
            _matchingClientActors,
            _matchingServerActors,
            stagedEntityType: sr.stagedEntityType,
            _type: "rule",
            _parent: originalRow,
          };
        } else {
          return {
            id: sr.id,
            client: {},
            server: {},
            active: false,
            _staged: [],
            author: sr.author,
            _override: DeleteRow,
            _matchingClientActors: [],
            _matchingServerActors: [],
            stagedEntityType: ApiAdminStagedEntityType.Del,
            stagingStatus: sr.stagingStatus,
            _type: "rule",
            _parent: originalRow,
          };
        }
      });
    };
  };
}
