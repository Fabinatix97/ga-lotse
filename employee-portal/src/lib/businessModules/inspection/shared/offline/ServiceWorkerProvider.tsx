/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { LoadingOverlay } from "@eshg/lib-portal/components/LoadingOverlay";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { unregisterServiceWorker } from "@/lib/businessModules/inspection/shared/offline/unregisterServiceWorker";
import { useIsOfflineFeatureEnabled } from "@/lib/businessModules/inspection/shared/offline/useIsOfflineFeatureEnabled";
import { useServiceWorkerMessageListeners } from "@/lib/businessModules/inspection/shared/offline/useServiceWorkerMessageListeners";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

export interface ServiceWorker {
  isOffline: boolean;
  sendMessageToServiceWorker: (message: object) => Promise<unknown>;
}

const ServiceWorkerContext = createContext<ServiceWorker>(null!);

export function ServiceWorkerProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const isOfflineEnabled = useIsOfflineFeatureEnabled();

  if (isOfflineEnabled) {
    return <ServiceWorkerProviderInner>{children}</ServiceWorkerProviderInner>;
  } else {
    return <ServiceWorkerProviderMock>{children}</ServiceWorkerProviderMock>;
  }
}

export function useServiceWorker(): ServiceWorker {
  const context = useContext(ServiceWorkerContext);
  if (context == null) {
    throw new Error(
      "useServiceWorker was called outside ServiceWorkerProvider",
    );
  }
  return context;
}

function ServiceWorkerProviderInner({
  children,
}: Readonly<{ children: ReactNode }>) {
  const isOffline = useIsOffline();

  const contextValue: ServiceWorker = useMemo(
    () => ({
      isOffline,
      sendMessageToServiceWorker,
    }),
    [isOffline],
  );

  const syncing = useServiceWorkerMessageListeners();

  return (
    <ServiceWorkerContext.Provider value={contextValue}>
      {syncing && <LoadingOverlay />}
      {children}
    </ServiceWorkerContext.Provider>
  );
}

function ServiceWorkerProviderMock({
  children,
}: Readonly<{ children: ReactNode }>) {
  // unregister real service worker
  useEffect(() => {
    unregisterServiceWorker();
  }, []);

  return (
    <ServiceWorkerContext.Provider value={EMPTY_CONTEXT}>
      {children}
    </ServiceWorkerContext.Provider>
  );
}

const EMPTY_CONTEXT: ServiceWorker = {
  isOffline: false,
  sendMessageToServiceWorker: async (_) => {
    /* empty */
  },
};

async function sendMessageToServiceWorker(message: object) {
  return (await window.workbox?.messageSW(message)) as unknown;
}
