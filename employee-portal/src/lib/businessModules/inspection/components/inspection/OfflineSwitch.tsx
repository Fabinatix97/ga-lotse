/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiInspectionPhase } from "@eshg/employee-portal-api/inspection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { getErrorDescription } from "@eshg/lib-portal/errorHandling/errorMappers";
import { resolveError } from "@eshg/lib-portal/errorHandling/errorResolvers";
import { CircularProgress, Switch, Typography } from "@mui/joy";

import { useLockInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";
import {
  clearCaches,
  deleteInspectionFromAllCaches,
} from "@/lib/businessModules/inspection/shared/offline/deleteInspectionFromAllCaches";
import { registerServiceWorker } from "@/lib/businessModules/inspection/shared/offline/registerServiceWorker";
import { useInspectionPrecacheState } from "@/lib/businessModules/inspection/shared/offline/useInspectionPrecacheState";
import { useIsOfflineFeatureEnabled } from "@/lib/businessModules/inspection/shared/offline/useIsOfflineFeatureEnabled";
import { usePrecacheInspections } from "@/lib/businessModules/inspection/shared/offline/usePrecacheInspections";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";
import {
  GET_PASSWORD,
  GET_PASSWORD_ABORTED,
  PASSWORD_ACCEPTED,
  createOfflinePasswordBroadCastChannelEndpoint,
  createPreemptivePasswordMessage,
  isPasswordMessage,
} from "@/serviceWorker/common/offlinePasswordBroadCastChannel";
import { precachedInspectionIds } from "@/serviceWorker/common/precachedInspectionIds";

export interface PrecacheOfflineSwitchProps {
  procedureId: string;
  currentPhase: ApiInspectionPhase;
  label?: string;
}

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

const passwordChannel = createOfflinePasswordBroadCastChannelEndpoint();
let firstLoad = true;

function OfflineSwitchInner({
  procedureId,
  currentPhase,
  label,
}: Readonly<PrecacheOfflineSwitchProps>) {
  const { state, handleOffline, handleOnline } =
    useInspectionOffline(procedureId);

  const hasntReachedExecutingPhase = inspectionIsBeforePhase(
    currentPhase,
    ApiInspectionPhase.ReadyForExecution,
  );
  const offline = useIsOffline();

  if (offline || hasntReachedExecutingPhase) return false;

  const switchElement = (
    <>
      {["fetching", "deleting"].includes(state) ? (
        <CircularProgress size="sm" />
      ) : (
        <Switch
          checked={state === "success"}
          onChange={async (event) =>
            await (event.target.checked ? handleOffline() : handleOnline())
          }
        />
      )}
    </>
  );

  if (!label) return switchElement;

  return (
    <Typography component="label" endDecorator={switchElement}>
      Offline-Modus
    </Typography>
  );
}

function useInspectionOffline(procedureId: string) {
  const lockInspection = useLockInspection();
  const [state, setState] = useInspectionPrecacheState(procedureId);
  const snackbar = useSnackbar();

  if (firstLoad) {
    firstLoad = false;
    void precachedInspectionIds.clean();
  }

  const precacheInspection = usePrecacheInspections();

  function errorSnackbar(error: unknown, action?: string) {
    const { errorCode } = resolveError(error);
    const { title, message } = getErrorDescription(errorCode);
    if (action) {
      snackbar.error(`${action}: ${title}: ${message}`);
    } else {
      snackbar.error(`${title}: ${message}`);
    }
  }

  async function handleOffline() {
    await setState("fetching");
    try {
      await lockInspection(procedureId, true);
    } catch (error) {
      await setState("idle");
      errorSnackbar(error);
    }
    const password = await getPassword();
    try {
      await registerServiceWorker();
      if (password) {
        passwordChannel.postMessage(createPreemptivePasswordMessage(password));
      }
      await precacheInspection(procedureId);
    } catch (error) {
      await handleOnline();
      errorSnackbar(
        error,
        "Fehler bei der Zwischenspeicherung der Offline-Daten",
      );
    }
    await setState("success");
  }

  async function handleOnline() {
    await setState("deleting");
    await lockInspection(procedureId, false).catch(() =>
      // eslint-disable-next-line no-console
      console.error("Failed to unlock inspection", procedureId),
    );
    await deleteInspectionFromAllCaches(procedureId);
    if ((await precachedInspectionIds.size()) === 0) {
      await clearCaches();
    }
    await setState("idle");
  }

  return {
    state,
    handleOffline,
    handleOnline,
  };
}

async function getPassword() {
  const serviceWorkerRegistered = await workboxPrecacheExists();
  if (serviceWorkerRegistered) return undefined;
  const offlinePasswordChannel =
    createOfflinePasswordBroadCastChannelEndpoint();
  return new Promise<string>((resolve, reject) => {
    offlinePasswordChannel.onmessage = (ev) => {
      if (isPasswordMessage(ev.data)) {
        const { password } = ev.data;
        resolve(password);
        offlinePasswordChannel.onmessage = null;
        offlinePasswordChannel.postMessage(PASSWORD_ACCEPTED);
      } else if (ev.data === GET_PASSWORD_ABORTED) {
        reject(new Error("Vorgang abgebrochen"));
        offlinePasswordChannel.onmessage = null;
      }
    };
    offlinePasswordChannel.postMessage(GET_PASSWORD);
  });
}

async function workboxPrecacheExists() {
  return (await caches.keys()).some((key) =>
    key.startsWith("workbox-precache-"),
  );
}
