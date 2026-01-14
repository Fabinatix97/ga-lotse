/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useCallback, useEffect, useState } from "react";

import { precachedInspectionIds } from "@/serviceWorker/common/precachedInspectionIds";
import {
  createPrecachedInspectionIdsBroadCastChannelEndpoint,
  isInspectionChangedMessage,
} from "@/serviceWorker/common/precachedInspectionIdsBroadCastChannel";

type State = "idle" | "fetching" | "deleting" | "success";

// synchronized with indexeddb
export function useInspectionPrecacheState(
  procedureId: string,
): [state: State, setState: (state: State) => Promise<void>] {
  const [state, setState] = useState<State>("fetching");

  useEffect(() => {
    let isMounted = true;
    void precachedInspectionIds
      .get(procedureId)
      .then((s) => isMounted && setState(s ?? "idle"));
    const channel = createPrecachedInspectionIdsBroadCastChannelEndpoint();
    channel.onmessage = async (event: MessageEvent) => {
      if (!isInspectionChangedMessage(event.data)) return;
      const { inspectionId } = event.data;
      if (inspectionId !== procedureId) return;
      const s = (await precachedInspectionIds.get(procedureId)) ?? "idle";
      if (isMounted) setState(s);
    };
    return () => {
      channel?.close();
      isMounted = false;
    };
  }, [procedureId]);

  const setStateExternal = useCallback(
    async (state: State) => {
      setState(state);
      switch (state) {
        case "idle":
          await precachedInspectionIds.delete(procedureId);
          break;
        case "fetching":
          await precachedInspectionIds.add(procedureId, "fetching");
          break;
        default:
          await precachedInspectionIds.updateState(procedureId, state);
      }
    },
    [procedureId],
  );

  return [state, setStateExternal];
}
