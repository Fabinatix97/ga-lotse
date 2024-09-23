/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { deleteAllEncryptedCaches } from "@/lib/businessModules/inspection/shared/offline/deleteInspectionFromAllCaches";
import { OfflineExistingPasswordDialog } from "@/lib/businessModules/inspection/shared/offline/password/OfflineExistingPasswordDialog";
import { OfflineNewPasswordDialog } from "@/lib/businessModules/inspection/shared/offline/password/OfflineNewPasswordDialog";
import { hasQueuedRequests } from "@/lib/businessModules/inspection/shared/offline/password/hasQueuedRequests";
import { useIsOfflineFeatureEnabled } from "@/lib/businessModules/inspection/shared/offline/useIsOfflineFeatureEnabled";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import {
  GET_EXISTING_PASSWORD,
  GET_PASSWORD,
  GET_PASSWORD_FAILED,
  PASSWORD_ACCEPTED,
  REGISTER_CLIENT,
  createOfflinePasswordBroadCastChannelEndpoint,
  createPasswordMessage,
} from "@/serviceWorker/common/offlinePasswordBroadCastChannel";

export function OfflinePasswordPrompt() {
  const isOfflineEnabled = useIsOfflineFeatureEnabled();

  if (!isOfflineEnabled) return false;

  return <OfflinePasswordPromptInner />;
}

function OfflinePasswordPromptInner() {
  const router = useRouter();
  const snackbar = useSnackbar();

  const [passwordChannel, setPasswordChannel] = useState<BroadcastChannel>();

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
        [PASSWORD_ACCEPTED, GET_PASSWORD_FAILED].includes(ev.data as string)
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

  const handlePassword = useCallback(
    async (password: string) => {
      setState({ ...state, passwordSent: true });
      let salt;
      try {
        salt = await getSalt(state.getExistingPassword);
      } catch {
        snackbar.error("Wiederherstellung fehlgeschlagen (salt lost)");
        await deleteAllEncryptedCaches();
        passwordChannel?.postMessage(GET_PASSWORD_FAILED);
        router.refresh();
        return;
      }
      passwordChannel?.postMessage(createPasswordMessage(password, salt));
    },
    [state, passwordChannel, snackbar, router],
  );

  const handleClear = useHandleClear(passwordChannel);

  if (!passwordChannel) return false;

  return state.getExistingPassword ? (
    <OfflineExistingPasswordDialog
      onPassword={handlePassword}
      onClear={handleClear}
      waiting={state.passwordSent}
      retry={state.retry}
    />
  ) : (
    <OfflineNewPasswordDialog
      onPassword={handlePassword}
      waiting={state.passwordSent}
    />
  );
}

function useHandleClear(passwordChannel: BroadcastChannel | undefined) {
  const router = useRouter();
  const { openConfirmationDialog } = useConfirmationDialog();
  return useCallback(async () => {
    const queuedRequests = await hasQueuedRequests();

    async function onConfirm() {
      await deleteAllEncryptedCaches();
      passwordChannel?.postMessage(GET_PASSWORD_FAILED);
      window.location.reload();
      router.refresh();
    }

    if (queuedRequests) {
      openConfirmationDialog({
        title: "Änderung verwerfen?",
        description:
          "Es liegen noch nicht synchronisierte Eingaben zu Begehung(en) vor. Beim Fortfahren gehen diese verloren.",
        confirmLabel: "Verwerfen",
        color: "danger",
        onConfirm,
      });
    } else {
      await onConfirm();
    }
  }, [openConfirmationDialog, passwordChannel, router]);
}

async function getSalt(restoreSalt: boolean) {
  if (restoreSalt) {
    const base64Salt = localStorage.getItem("offline-password-salt");
    if (!base64Salt) {
      return Promise.reject(new Error("Salt lost"));
    }
    return base64StringToBytesArrayBuffer(base64Salt);
  } else {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    localStorage.setItem(
      "offline-password-salt",
      arrayBufferToBase64String(salt),
    );
    return Promise.resolve(salt);
  }
}

function base64StringToBytesArrayBuffer(base64: string): ArrayBufferLike {
  const binString = atob(base64);
  // @ts-expect-error js still hasn't got a proper way to base64decode binary data
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

function arrayBufferToBase64String(buffer: ArrayBufferLike): string {
  const bytes = new Uint8Array(buffer);
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join("");
  return btoa(binString);
}
