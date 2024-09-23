/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useCallback } from "react";

import { useServiceWorker } from "@/lib/businessModules/inspection/shared/offline/ServiceWorkerProvider";

type State = "idle" | "fetching" | "success";

export function useServiceWorkerForInspection(inspectionId: string): {
  state: State;
  precachedInspections: number;
  register: () => void;
  unregister: () => void;
} {
  const {
    actualPrecachedInspectionIds,
    desiredPrecachedInspectionIds,
    addToPrecache,
    removeFromPrecache,
  } = useServiceWorker();
  const state = !desiredPrecachedInspectionIds.includes(inspectionId)
    ? "idle"
    : !actualPrecachedInspectionIds.includes(inspectionId)
      ? "fetching"
      : "success";

  const precachedInspections = Math.max(
    actualPrecachedInspectionIds.length,
    desiredPrecachedInspectionIds.length,
  );

  const register = useCallback(() => {
    addToPrecache(inspectionId);
  }, [addToPrecache, inspectionId]);
  const unregister = useCallback(() => {
    removeFromPrecache(inspectionId);
  }, [inspectionId, removeFromPrecache]);

  return { state, precachedInspections, register, unregister };
}
