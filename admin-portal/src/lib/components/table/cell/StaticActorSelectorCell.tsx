/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAdminActorSelector } from "@eshg/service-directory-api";
import { Stack } from "@mui/joy";
import { CellContext } from "@tanstack/react-table";

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
      ></ActorsChip>
    </Stack>
  );
}

export function formatActorSelector(s: ApiAdminActorSelector) {
  return `${format(s.federalState)}/${format(s.orgUnitType)}/${format(s.orgUnitName)}/${format(s.actorType)}/${format(s.actorName)}`;
}

function format(value: string | undefined): string {
  if (value == null) {
    return "*";
  }
  return value;
}
