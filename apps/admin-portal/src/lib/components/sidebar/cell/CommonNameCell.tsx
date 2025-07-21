/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReactNode } from "react";

import { CommonCellProps } from "@/lib/components/sidebar/cell/CommonCellProps";
import { StringCell } from "@/lib/components/sidebar/cell/StringCell";
import { isActor } from "@/lib/helpers/entityValidation";
import { ActorData } from "@/lib/hooks/useEntities";

export function CommonNameCell(
  props: Readonly<CommonCellProps<ActorData>>,
): ReactNode {
  if (!isActor(props.entity)) {
    throw new Error("CommonNameCell used with non-actor entity");
  }
  if (!!props.entity.entity?.certificate) {
    return props.entity.entity?.commonName;
  }

  return <StringCell {...props} />;
}
