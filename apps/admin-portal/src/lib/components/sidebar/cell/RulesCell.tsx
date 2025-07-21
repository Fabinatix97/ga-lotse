/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReactNode } from "react";

import { CommonCellProps } from "@/lib/components/sidebar/cell/CommonCellProps";
import { EntityListInTooltip } from "@/lib/components/table/cell/common/ActorListInTooltip";
import { ActorData, Rule } from "@/lib/hooks/useEntities";
import { useTranslation } from "@/lib/i18n/client";

export function RulesCell(
  props: Readonly<CommonCellProps<ActorData>>,
): ReactNode {
  const { t } = useTranslation();

  let linkName: string;
  let rules: Rule[] | undefined;
  switch (props.id) {
    case "_matchingClientRules":
      linkName = "_matchingClientActors";
      rules = props.entity.entity?._matchingClientRules;
      break;
    case "_matchingServerRules":
      linkName = "_matchingServerActors";
      rules = props.entity.entity?._matchingServerRules;
      break;
    default:
      // eslint-disable-next-line no-console
      console.error("Unexpected column ID:", props.id);
      linkName = "";
  }

  const length = rules?.length ?? 0;
  const value = !length ? "" : `${t("rules", { count: length })}`;

  return (
    <EntityListInTooltip
      linkTo="rules"
      actors={rules ?? []}
      linkName={linkName}
      linkValue={props.entity.id}
    >
      {value}
    </EntityListInTooltip>
  );
}
