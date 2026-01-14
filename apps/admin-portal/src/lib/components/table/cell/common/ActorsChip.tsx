/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip } from "@mui/joy";
import { ReactNode } from "react";

import { ActorListInTooltip } from "@/lib/components/table/cell/common/ActorListInTooltip";
import { Actor } from "@/lib/hooks/useEntities";

export function ActorsChip(
  props: Readonly<{
    actors: Actor[];
    columnId: string;
    rowId: string;
    linkName: string;
  }>,
): ReactNode {
  return (
    <ActorListInTooltip
      actors={props.actors}
      linkName={props.linkName}
      linkValue={props.rowId}
    >
      <Chip
        variant="outlined"
        sx={{ "--Chip-radius": (theme) => theme.spacing(1) }}
      >
        {props.actors.length}
      </Chip>
    </ActorListInTooltip>
  );
}
