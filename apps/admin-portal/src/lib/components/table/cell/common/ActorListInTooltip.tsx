/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Tooltip, styled } from "@mui/joy";
import { PropsWithChildren } from "react";

import { EntityLink } from "@/lib/components/layout/nav/EntityLink";
import { EmptyCell } from "@/lib/components/table/cell/common/EmptyCell";
import { entityIdForLink, entityToString } from "@/lib/helpers/entityToString";
import { EntityWrapper } from "@/lib/hooks/useEntities";

export function ActorListInTooltip({
  children,
  ...props
}: Readonly<
  PropsWithChildren<{
    actors: EntityWrapper[];
    linkName: string;
    linkValue: string;
  }>
>) {
  return (
    <EntityListInTooltip linkTo="actors" {...props}>
      {children}
    </EntityListInTooltip>
  );
}

export function EntityListInTooltip({
  children,
  linkTo,
  actors,
  linkName,
  linkValue,
}: Readonly<
  PropsWithChildren<{
    linkTo?: string;
    actors: EntityWrapper[];
    linkName: string;
    linkValue: string;
  }>
>) {
  return actors?.length ? (
    <Tooltip title={<Title value={actors} linkTo={linkTo} />}>
      <EntityLink linkTo={linkTo} name={linkName} value={linkValue}>
        {children}
      </EntityLink>
    </Tooltip>
  ) : (
    <EmptyCell />
  );
}

export function Title({
  value,
  linkTo,
}: Readonly<{
  value?: EntityWrapper[];
  linkTo?: string;
}>) {
  if (!value || value.length < 1) {
    return undefined;
  }

  return (
    <SStack flexDirection="column">
      {value.map((v) => {
        return (
          <EntityLink key={v.id} linkTo={linkTo} value={entityIdForLink(v)}>
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
