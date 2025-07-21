/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReactNode } from "react";

import { CommonCellProps } from "@/lib/components/sidebar/cell/CommonCellProps";
import { ActorListInTooltip } from "@/lib/components/table/cell/common/ActorListInTooltip";
import { entityIdForLink } from "@/lib/helpers/entityToString";
import { OrgUnitData } from "@/lib/hooks/useEntities";
import { useTranslation } from "@/lib/i18n/client";

export function ActorsCell(
  props: Readonly<CommonCellProps<OrgUnitData>>,
): ReactNode {
  const { t } = useTranslation();

  const value = !props.entity.entity?._actors?.length
    ? ""
    : `${t("actors", { count: props.entity.entity._actors.length })}`;

  return (
    <ActorListInTooltip
      actors={props.entity.entity?._actors ?? []}
      linkName="_orgUnit"
      linkValue={entityIdForLink(props.entity)}
    >
      {value}
    </ActorListInTooltip>
  );
}
