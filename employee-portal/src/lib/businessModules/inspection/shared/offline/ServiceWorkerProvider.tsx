/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { useIsOffline } from "@eshg/lib-employee-portal";
import { LoadingOverlay } from "@eshg/lib-portal/components/LoadingOverlay";

import { unregisterServiceWorker } from "@/lib/businessModules/inspection/shared/offline/unregisterServiceWorker";
import { useIsOfflineFeatureEnabled } from "@/lib/businessModules/inspection/shared/offline/useIsOfflineFeatureEnabled";
import { useServiceWorkerSyncQueue } from "@/lib/businessModules/inspection/shared/offline/useServiceWorkerSyncQueue";

interface ServiceWorker {
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

  const syncing = useServiceWorkerSyncQueue();

  return (
    <ServiceWorkerContext value={contextValue}>
      {syncing && <LoadingOverlay />}
      {children}
    </ServiceWorkerContext>
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
    <ServiceWorkerContext value={EMPTY_CONTEXT}>
      {children}
    </ServiceWorkerContext>
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
