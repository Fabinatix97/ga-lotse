/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal";

import { SyncButton } from "./SyncButton";

interface SyncBarrierProps {
  outdated: boolean;
  syncHref: string;
}

export function SyncBarrier(props: SyncBarrierProps & RequiresChildren) {
  return (
    <>
      {props.outdated && <SyncButton href={props.syncHref} />}
      {props.children}
    </>
  );
}
