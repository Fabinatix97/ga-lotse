/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect, useRef, useState } from "react";

import { isSafari } from "@/lib/businessModules/inspection/shared/isSafari";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";
import {
  SYNC,
  createQueueBroadCastChannelEndpoint,
} from "@/serviceWorker/common/queueBroadCastChannel";

// Some browsers like Safari do not automatically sync queued requests when they
// go online. As a workaround, we tell the service-worker to sync manually.

export function NoSyncWorkaround() {
  const isSyncEventSupported = useIsSyncEventSupported();
  return !isSyncEventSupported && <InnerSafariSyncWorkaround />;
}

let queueChannel: BroadcastChannel;

function InnerSafariSyncWorkaround() {
  const offline = useIsOffline();
  const wasOffline = useRef(false);

  useEffect(() => {
    wasOffline.current ||= offline;
    if (!offline && wasOffline.current) {
      // eslint-disable-next-line no-console
      console.log("Syncing service-worker queue manually");
      queueChannel ??= createQueueBroadCastChannelEndpoint();
      queueChannel.postMessage(SYNC);
    }
  }, [offline]);

  return false;
}

function useIsSyncEventSupported() {
  const [isSyncSupported, setIsSyncSupported] = useState(!isSafari());

  useEffect(() => {
    getRegistration().then(
      (registration) => setIsSyncSupported("sync" in (registration ?? {})),
      (reason) => {
        throw reason;
      },
    );
  }, []);

  return isSyncSupported;
}

async function getRegistration() {
  const sw = await window.workbox?.controlling;
  const scriptUrl = sw?.scriptURL;
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    if (registration.active?.scriptURL === scriptUrl) {
      return registration;
    }
  }
  return undefined;
}
