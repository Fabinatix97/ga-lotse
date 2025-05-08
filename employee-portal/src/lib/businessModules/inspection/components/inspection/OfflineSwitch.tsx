/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { CircularProgress, Switch, Typography } from "@mui/joy";

import { ApiInspectionPhase } from "@eshg/inspection-api";
import { useIsOffline } from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { getErrorDescription } from "@eshg/lib-portal/errorHandling/errorMappers";
import { resolveError } from "@eshg/lib-portal/errorHandling/errorResolvers";

import { useLockInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";
import {
  clearCaches,
  deleteInspectionFromAllCaches,
} from "@/lib/businessModules/inspection/shared/offline/deleteInspectionFromAllCaches";
import {
  isServiceWorkerRegistered,
  registerServiceWorker,
} from "@/lib/businessModules/inspection/shared/offline/registerServiceWorker";
import { useInspectionPrecacheState } from "@/lib/businessModules/inspection/shared/offline/useInspectionPrecacheState";
import { useIsOfflineFeatureEnabled } from "@/lib/businessModules/inspection/shared/offline/useIsOfflineFeatureEnabled";
import { usePrecacheInspections } from "@/lib/businessModules/inspection/shared/offline/usePrecacheInspections";
import {
  GET_PASSWORD,
  GET_PASSWORD_ABORTED,
  PASSWORD_ACCEPTED,
  createOfflinePasswordBroadCastChannelEndpoint,
  createPreemptivePasswordMessage,
  isPasswordMessage,
} from "@/serviceWorker/common/offlinePasswordBroadCastChannel";
import { precachedInspectionIds } from "@/serviceWorker/common/precachedInspectionIds";

interface PrecacheOfflineSwitchProps {
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

  const switchElement = ["fetching", "deleting"].includes(state) ? (
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
      return;
    }

    let password;
    try {
      password = await askForNewPassword();
    } catch {
      await cleanup(false);
      return;
    }

    try {
      await registerServiceWorker();
      if (password) {
        passwordChannel.postMessage(createPreemptivePasswordMessage(password));
      }
      await precacheInspection(procedureId);
    } catch (error) {
      await cleanup(true);
      errorSnackbar(
        error,
        "Fehler bei der Zwischenspeicherung der Offline-Daten",
      );
      return;
    }
    await setState("success");
  }

  async function handleOnline() {
    await cleanup(true);
  }

  async function cleanup(clearCachedInspection: boolean) {
    await setState("deleting");
    await lockInspection(procedureId, false).catch(() =>
      // eslint-disable-next-line no-console
      console.error("Failed to unlock inspection", procedureId),
    );
    if (clearCachedInspection) {
      await deleteInspectionFromAllCaches(procedureId);
      if ((await precachedInspectionIds.size()) === 0) {
        await clearCaches();
      }
    }
    await setState("idle");
  }

  return {
    state,
    handleOffline,
    handleOnline,
  };
}

async function askForNewPassword() {
  const serviceWorkerRegistered = await isServiceWorkerRegistered();
  if (serviceWorkerRegistered) {
    // no need to post GET_PASSWORD message -- service worker will ask for it
    return undefined;
  }
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
