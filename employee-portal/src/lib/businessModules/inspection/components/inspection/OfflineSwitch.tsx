/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiInspectionPhase } from "@eshg/employee-portal-api/inspection";
import { CircularProgress, Switch, Typography } from "@mui/joy";

import { useServiceWorkerForInspection } from "@/lib/businessModules/inspection/api/hooks/useServiceWorkerForInspection";
import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";
import { useIsOfflineFeatureEnabled } from "@/lib/businessModules/inspection/shared/offline/useIsOfflineFeatureEnabled";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

export interface PrecacheOfflineSwitchProps {
  procedureId: string;
  currentPhase: ApiInspectionPhase;
  label?: string;
}

const MAXIMUM_PRECACHED_INSPECTIONS = 10;

export function OfflineSwitch({
  procedureId,
  currentPhase,
  label,
}: Readonly<PrecacheOfflineSwitchProps>) {
  const isOfflineEnabled = useIsOfflineFeatureEnabled();

  if (!isOfflineEnabled) return false;

  return (
    <OfflineSwitchInner
      procedureId={procedureId}
      currentPhase={currentPhase}
      label={label}
    />
  );
}

function OfflineSwitchInner({
  procedureId,
  currentPhase,
  label,
}: Readonly<PrecacheOfflineSwitchProps>) {
  const { state, precachedInspections, register, unregister } =
    useServiceWorkerForInspection(procedureId);
  const { mutateAsync: updateInspection } = useUpdateInspection();

  const hasntReachedExecutingPhase = inspectionIsBeforePhase(
    currentPhase,
    ApiInspectionPhase.ReadyForExecution,
  );
  const offline = useIsOffline();

  if (precachedInspections >= MAXIMUM_PRECACHED_INSPECTIONS) {
    return "Maximalanzahl von offlinefähigen Begehungsvorgängen erreicht";
  }

  if (offline || hasntReachedExecutingPhase) return false;

  async function lockInspection(lockInspection: boolean) {
    await updateInspection({
      id: procedureId,
      apiUpdateInspectionRequest: { lock: lockInspection },
    });
  }

  async function handleOffline() {
    await lockInspection(true);
    register();
  }

  async function handleOnline() {
    await lockInspection(false);
    unregister();
  }

  const switchElement =
    "fetching" === state ? (
      <CircularProgress size="sm" />
    ) : (
      <Switch
        checked={state === "success"}
        onChange={async (event) =>
          await (event.target.checked ? handleOffline() : handleOnline())
        }
      />
    );

  if (!label) return switchElement;

  return (
    <Typography component="label" endDecorator={switchElement}>
      Offline-Modus
    </Typography>
  );
}
