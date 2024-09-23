/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAdminActorSelector,
  ApiAdminCertificate,
} from "@eshg/admin-portal-api/serviceDirectory";
import { CellContext } from "@tanstack/react-table";
import { ReactNode } from "react";
import { isDeepEqual } from "remeda";

import { ColoredText } from "@/lib/components/table/cell/ColoredText";
import { AuditEntity, RevisionType } from "@/lib/types/audit";

export function AuditCell<
  TData extends AuditEntity,
  TValue extends
    | undefined
    | string
    | boolean
    | ApiAdminCertificate
    | Date
    | ApiAdminActorSelector,
>(
  props: Readonly<
    CellContext<
      TData,
      {
        old?: TValue;
        new?: TValue;
      }
    >
  >,
): ReactNode {
  switch (props.row.original.revisionType) {
    case RevisionType.ADD:
      return <ColoredText color="success" value={props.getValue().new} />;
    case RevisionType.MOD:
      return <Diff old={props.getValue().old} new={props.getValue().new} />;
    case RevisionType.DEL:
      return <ColoredText color="danger" value={props.getValue().old} />;
  }
}

function Diff<
  TValue extends
    | string
    | boolean
    | ApiAdminCertificate
    | Date
    | ApiAdminActorSelector,
>(
  props: Readonly<{ old: TValue | undefined; new: TValue | undefined }>,
): ReactNode {
  if (props.old == null) {
    return <ColoredText color="success" value={props.new} />;
  }
  if (props.new == null) {
    return <ColoredText color="danger" value={props.old} />;
  }
  if (isDeepEqual(props.old, props.new)) {
    return <ColoredText value={props.old} color="neutral" />;
  }

  return (
    <>
      <ColoredText color="danger" value={props.old} />
      {" → "}
      <ColoredText color="success" value={props.new} />
    </>
  );
}
