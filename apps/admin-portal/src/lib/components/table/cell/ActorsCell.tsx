/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CellContext } from "@tanstack/react-table";
import { ReactNode } from "react";

import { ActorListInTooltip } from "@/lib/components/table/cell/common/ActorListInTooltip";
import { entityIdForLink } from "@/lib/helpers/entityToString";
import { Actor, OrgUnit, Rule } from "@/lib/hooks/useEntities";
import { useTranslation } from "@/lib/i18n/client";

export function ActorsCell<TData extends OrgUnit | Rule>(
  props: Readonly<CellContext<TData, Actor[]>>,
): ReactNode {
  const { t } = useTranslation();

  const value = !props.getValue()?.length
    ? ""
    : `${t("actors", { count: props.getValue().length })}`;
  return (
    <ActorListInTooltip
      actors={props.getValue()}
      linkName="_orgUnit"
      linkValue={entityIdForLink(props.row.original)}
    >
      {value}
    </ActorListInTooltip>
  );
}
