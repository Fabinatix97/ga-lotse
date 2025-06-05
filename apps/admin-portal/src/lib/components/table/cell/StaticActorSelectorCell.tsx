/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { CellContext } from "@tanstack/react-table";

import { ApiAdminActorSelector } from "@eshg/service-directory-api";

import { ActorsChip } from "@/lib/components/table/cell/ForeignKeyCell";
import { PartialActorWithId } from "@/lib/components/view/actors/ActorTable";
import { Rule } from "@/lib/hooks/useRules";

export function StaticActorSelectorCell(
  props: Readonly<CellContext<Rule, ApiAdminActorSelector>>,
) {
  let matchingActors: PartialActorWithId[] = [];
  let linkName = "";
  switch (props.column.id) {
    case "client":
      matchingActors = props.row.original._matchingClientActors;
      linkName = "_matchingClientRules";
      break;
    case "server":
      matchingActors = props.row.original._matchingServerActors;
      linkName = "_matchingServerRules";
      break;
    default:
      // eslint-disable-next-line no-console
      console.error("Unexpected column ID:", props.column.id);
  }

  return (
    <Stack gap={1} justifyContent="space-between">
      {formatActorSelector(props.getValue())}
      <ActorsChip
        actors={matchingActors}
        columnId={props.column.id}
        rowId={props.row.original.id}
        linkName={linkName}
      />
    </Stack>
  );
}

export function formatActorSelector(s: ApiAdminActorSelector) {
  return `${format(s.federalState)}/${format(s.orgUnitType)}/${format(s.orgUnitName)}/${format(s.actorType)}/${format(s.actorName)}`;
}

export function isActorSelector(s: unknown): s is ApiAdminActorSelector {
  return (
    typeof s === "object" &&
    s !== null &&
    "federalState" in s &&
    ["string", "undefined"].includes(typeof s.federalState) &&
    "orgUnitType" in s &&
    ["string", "undefined"].includes(typeof s.orgUnitType) &&
    "orgUnitName" in s &&
    ["string", "undefined"].includes(typeof s.orgUnitName) &&
    "actorType" in s &&
    ["string", "undefined"].includes(typeof s.actorType) &&
    "actorName" in s &&
    ["string", "undefined"].includes(typeof s.actorName)
  );
}

function format(value: string | undefined): string {
  if (value === undefined) {
    return "*";
  }
  return value;
}
