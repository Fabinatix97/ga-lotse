/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useEffect, useState } from "react";

import { useConfirmationDialog } from "@eshg/lib-employee-portal";

import { useLockInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import {
  clearCaches,
  clearQueue,
} from "@/lib/businessModules/inspection/shared/offline/deleteInspectionFromAllCaches";
import { OfflineExistingPasswordDialog } from "@/lib/businessModules/inspection/shared/offline/password/OfflineExistingPasswordDialog";
import { OfflineNewPasswordDialog } from "@/lib/businessModules/inspection/shared/offline/password/OfflineNewPasswordDialog";
import { hasQueuedRequests } from "@/lib/businessModules/inspection/shared/offline/password/hasQueuedRequests";
import { isServiceWorkerRegistered } from "@/lib/businessModules/inspection/shared/offline/registerServiceWorker";
import {
  SALT,
  getInspectionOfflineDb,
} from "@/serviceWorker/common/inspectionOfflineDb";
import {
  GET_EXISTING_PASSWORD,
  GET_PASSWORD,
  GET_PASSWORD_ABORTED,
  PASSWORD_ACCEPTED,
  REGISTER_CLIENT,
  createOfflinePasswordBroadCastChannelEndpoint,
  createPasswordMessage,
} from "@/serviceWorker/common/offlinePasswordBroadCastChannel";
import { precachedInspectionIds } from "@/serviceWorker/common/precachedInspectionIds";

export function OfflinePasswordPrompt() {
  const [passwordChannel, setPasswordChannel] = useState<BroadcastChannel>();
  const { openConfirmationDialog } = useConfirmationDialog();
  const lockInspection = useLockInspection();

  const [state, setState] = useState({
    getExistingPassword: false,
    passwordSent: false,
    retry: false,
  });

  useEffect(() => {
    const offlinePasswordChannel =
      createOfflinePasswordBroadCastChannelEndpoint();

    offlinePasswordChannel.onmessage = (ev) => {
      if (ev.data === GET_EXISTING_PASSWORD) {
        setPasswordChannel(offlinePasswordChannel);
        setState((prevState) => ({
          getExistingPassword: true,
          passwordSent: false,
          retry: prevState.passwordSent,
        }));
      } else if (ev.data === GET_PASSWORD) {
        setPasswordChannel(offlinePasswordChannel);
        setState({
          getExistingPassword: false,
          passwordSent: false,
          retry: false,
        });
      } else if (
        [PASSWORD_ACCEPTED, GET_PASSWORD_ABORTED].includes(ev.data as string)
      ) {
        setPasswordChannel(undefined);
        setState({
          getExistingPassword: false,
          passwordSent: false,
          retry: false,
        });
      }
    };
    offlinePasswordChannel.postMessage(REGISTER_CLIENT);

    return () => offlinePasswordChannel.close();
  }, []);

  async function handlePassword(password: string) {
    setState({ ...state, passwordSent: true });
    if (state.getExistingPassword) {
      await transferLegacySalt();
    }
    passwordChannel?.postMessage(createPasswordMessage(password));
  }

  async function handleClear() {
    const isRegistered = await isServiceWorkerRegistered();
    if (!isRegistered) {
      passwordChannel?.postMessage(GET_PASSWORD_ABORTED);
      setPasswordChannel(undefined);
      return;
    }
    const queuedRequests = await hasQueuedRequests();
    if (queuedRequests) {
      openConfirmationDialog({
        title: "Änderung verwerfen?",
        description:
          "Die Eingaben, die Sie offline gemacht hatten, sind noch nicht gespeichert worden. Wenn Sie jetzt fortfahren, gehen diese Eingaben verloren. Möchten Sie wirklich fortfahren und alle Änderungen verlieren?",
        confirmLabel: "Verwerfen",
        color: "danger",
        onConfirm: onConfirmClear,
      });
    } else {
      await onConfirmClear();
    }
  }

  async function onConfirmClear() {
    const ids = await precachedInspectionIds.getAll();
    await clearQueue();
    await precachedInspectionIds.clear();
    await clearCaches();
    await Promise.all(
      ids.map((id) =>
        lockInspection(id, false).catch(() =>
          // eslint-disable-next-line no-console
          console.error("Failed to unlock inspection", id),
        ),
      ),
    );
    passwordChannel?.postMessage(GET_PASSWORD_ABORTED);
    window.location.reload();
  }

  if (!passwordChannel) return false;

  return state.getExistingPassword ? (
    <OfflineExistingPasswordDialog
      waiting={state.passwordSent}
      retry={state.retry}
      onPassword={handlePassword}
      onClear={handleClear}
    />
  ) : (
    <OfflineNewPasswordDialog
      waiting={state.passwordSent}
      onPassword={handlePassword}
      onClear={handleClear}
    />
  );
}

// backwards-compatible restore legacy salt. new salt is stored in the index-db.
async function transferLegacySalt() {
  const base64Salt = localStorage.getItem("offline-password-salt");
  if (base64Salt) {
    await storeSalt(base64StringToBytesArrayBuffer(base64Salt));
    localStorage.removeItem("offline-password-salt");
  }
}

async function storeSalt(salt: ArrayBufferLike): Promise<void> {
  const db = await getInspectionOfflineDb();

  await db.put(SALT, { id: "offline-password-salt", salt });
}

function base64StringToBytesArrayBuffer(base64: string): ArrayBufferLike {
  const binString = atob(base64);
  // @ts-expect-error js still hasn't got a proper way to base64decode binary data
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}
