/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAdminActor } from "@eshg/admin-portal-api/serviceDirectory";
import { Chip, Stack, Tooltip, styled } from "@mui/joy";
import { CellContext } from "@tanstack/react-table";
import { ReactNode } from "react";

import { EntityLink } from "@/lib/components/layout/nav/EntityLink";
import { EmptyCell } from "@/lib/components/table/cell/EmptyCell";
import {
  Actor,
  PartialActorWithId,
} from "@/lib/components/view/actors/ActorTable";
import { UniqueEntity } from "@/lib/helpers/entities";
import { entityToString } from "@/lib/helpers/entityToString";
import { OrgUnit } from "@/lib/hooks/useOrgUnits";
import { PartialRuleWithId, Rule } from "@/lib/hooks/useRules";
import { useTranslation } from "@/lib/i18n/client";

export function ActorsCell<TData extends OrgUnit | Rule>(
  props: Readonly<CellContext<TData, ApiAdminActor[]>>,
): ReactNode {
  const { t } = useTranslation();

  const linkName = "_orgUnit";

  const value = !props.getValue()?.length
    ? ""
    : `${t("actors", { count: props.getValue().length })}`;

  return value ? (
    <Tooltip title={<Title value={props.getValue()} linkTo={"actors"} />}>
      <EntityLink
        linkTo={"actors"}
        name={linkName}
        value={props.row.original.id}
      >
        {value}
      </EntityLink>
    </Tooltip>
  ) : (
    <EmptyCell />
  );
}

export function ActorsChip(
  props: Readonly<{
    actors: PartialActorWithId[];
    columnId: string;
    rowId: string;
    linkName: string;
  }>,
): ReactNode {
  return props.actors.length > 0 ? (
    <Tooltip title={<Title value={props.actors} linkTo={"actors"} />}>
      <EntityLink linkTo={"actors"} name={props.linkName} value={props.rowId}>
        <Chip
          variant="outlined"
          sx={{ "--Chip-radius": (theme) => theme.spacing(1) }}
        >
          {props.actors.length}
        </Chip>
      </EntityLink>
    </Tooltip>
  ) : (
    <EmptyCell />
  );
}

export function RulesCell<TData extends Actor>(
  props: Readonly<CellContext<TData, PartialRuleWithId[]>>,
): ReactNode {
  const { t } = useTranslation();

  let linkName: string;
  switch (props.column.id) {
    case "_matchingClientRules":
      linkName = "_matchingClientActors";
      break;
    case "_matchingServerRules":
      linkName = "_matchingServerActors";
      break;
    default:
      // eslint-disable-next-line no-console
      console.error("Unexpected column ID:", props.column.id);
      linkName = "";
  }

  const length = props.getValue().length;
  const value = !length ? "" : `${t("rules", { count: length })}`;

  return value ? (
    <Tooltip
      title={
        <Title
          value={props.getValue()}
          linkTo={props.column.columnDef.meta?.linkTo}
        />
      }
    >
      <EntityLink
        linkTo={props.column.columnDef.meta?.linkTo}
        name={linkName}
        value={props.row.original.id}
      >
        {value}
      </EntityLink>
    </Tooltip>
  ) : (
    <EmptyCell />
  );
}

function Title({
  value,
  linkTo,
}: Readonly<{
  value?: UniqueEntity[];
  linkTo?: string;
}>) {
  if (!value || value.length < 1) {
    return undefined;
  }

  return (
    <SStack flexDirection="column">
      {value.map((v) => {
        return (
          <EntityLink key={v.id} linkTo={linkTo} value={v.naturalId ?? v.id}>
            {entityToString(v, true)}
          </EntityLink>
        );
      })}
    </SStack>
  );
}

const SStack = styled(Stack)(() => ({
  "& .MuiLink-root": {
    color: "var(--joy-palette-neutral-solidColor)",
    textDecorationColor: "var(--joy-palette-neutral-solidColor)",
  },
}));
