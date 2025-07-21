/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { CellContext } from "@tanstack/react-table";

import { ApiAdminActorSelector } from "@eshg/service-directory-api";

import { ActorsChip } from "@/lib/components/table/cell/common/ActorsChip";
import { formatActorSelector } from "@/lib/helpers/actorSelector";
import { Actor, Rule } from "@/lib/hooks/useEntities";

export function ActorSelectorCell(
  props: Readonly<CellContext<Rule, ApiAdminActorSelector>>,
) {
  let matchingActors: Actor[] = [];
  let linkName = "";
  switch (props.column.id) {
    case "entity.client":
      matchingActors = props.row.original.entity?._matchingClientActors ?? [];
      linkName = "_matchingClientRules";
      break;
    case "entity.server":
      matchingActors = props.row.original.entity?._matchingServerActors ?? [];
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
